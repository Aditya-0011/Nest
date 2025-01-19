import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient } from 'pg';
import puppeteer, { Browser } from 'puppeteer-core';

@Injectable()
export class NewsSchedule {
  private readonly pool: Pool;
  private readonly ChromePath: string;

  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('DB_URL');
    this.pool = new Pool({ connectionString });
    this.ChromePath = configService.get<string>('CHROME_PATH');
  }

  private async fetchNews(): Promise<void> {
    let browser: Browser;
    const client: PoolClient = await this.pool.connect();
    try {
      browser = await puppeteer.launch({
        executablePath: this.ChromePath,
      });
      const page = await browser.newPage();

      await page.goto('https://news.ycombinator.com/newest');

      let moreNews = true;

      while (moreNews) {
        const rows = await page.evaluate(() => {
          const rows = Array.from(document.querySelectorAll('.athing'));
          return rows.map((row) => {
            const id = row.getAttribute('id');
            const titleElem = row.querySelector('.titleline a');
            const title = titleElem?.textContent;
            const link = titleElem?.getAttribute('href');
            const timeElem = row.nextElementSibling.querySelector('.age');
            const time = timeElem?.getAttribute('title').split(' ')[1];
            const scoreElem = row.nextElementSibling.querySelector('.score');
            const score = scoreElem?.textContent.split(' ')[0];

            return { id, title, link, score, time };
          });
        });

        for (const row of rows) {
          const { rows: existingNews } = await client.query(
            'SELECT 1 FROM news WHERE id = $1 LIMIT 1',
            [row.id],
          );

          if (existingNews.length > 0) {
            moreNews = false;
            break;
          }

          await client.query(
            'CALL insert_news($1::bigint, $2, $3, $4::int, $5::bigint)',
            [row.id, row.title, row.link, row.score, row.time],
          );
        }

        if (moreNews) {
          const nextPageButton = await page.$('.morelink');
          if (nextPageButton) {
            console.log('Clicking next page');
            await nextPageButton.click();
            await new Promise((resolve) => setTimeout(resolve, 2000));
          } else {
            moreNews = false;
          }
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      await browser.close();
      client.release();
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    await this.fetchNews();
  }
}
