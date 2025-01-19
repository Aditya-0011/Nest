import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NewsGateway } from './gateway/news.gateway';
import { NewsSchedule } from './schedule/news.schedule';
import { NewsService } from './news.service';

@Module({
  imports: [ScheduleModule.forRoot(), EventEmitterModule.forRoot()],
  providers: [NewsGateway, NewsSchedule, NewsService],
})
export class NewsModule {}
