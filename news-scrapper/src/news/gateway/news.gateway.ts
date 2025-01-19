import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import { NewsService } from '../news.service';
import { News } from '../dto/news.response';

@Injectable()
@WebSocketGateway()
export class NewsGateway implements OnGatewayConnection {
  private readonly newsService: NewsService;

  @WebSocketServer()
  server: Server;

  constructor(newsService: NewsService) {
    this.newsService = newsService;
  }

  async handleConnection(client: Socket): Promise<void> {
    const recentNews = await this.newsService.getRecentNews();
    client.emit('news', recentNews);
  }

  @OnEvent('news.added')
  async handleNewsCreated(news: News): Promise<void> {
    this.server.emit('news', news);
  }
}
