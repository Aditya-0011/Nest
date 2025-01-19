import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Pool, PoolClient } from 'pg';
import { Payload } from './types/news';
import { News } from './dto/news.response';

@Injectable()
export class NewsService implements OnModuleInit, OnModuleDestroy {
  private readonly pool: Pool;
  private readonly eventEmitter: EventEmitter2;

  constructor(configService: ConfigService, eventEmitter: EventEmitter2) {
    const connectionString = configService.get<string>('DB_URL');
    this.eventEmitter = eventEmitter;
    this.pool = new Pool({ connectionString });
  }

  async onModuleInit(): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      await client.query('LISTEN news_added');

      client.on('notification', (notification) => {
        const payload: Payload = JSON.parse(notification.payload);
        if (payload.type === 'new') {
          this.eventEmitter.emit('news.added', payload.news);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  async getRecentNews(): Promise<News[]> {
    try {
      const news = await this.pool.query(`
            select id, title, link, score, created_at from news 
            where created_at >= now() - interval '5 minutes' 
            order by created_at desc;
            `);

      return news.rows.map((n) =>
        Object.assign(new News(), {
          id: n.id,
          title: n.title,
          link: n.link,
          score: n.score,
          created_at: n.created_at,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  }
}
