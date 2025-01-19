export class news {
  id: number;
  title: string;
  link: string;
  score: number;
  created_at: Date;
}

export interface Payload {
  type: 'new';
  news: news;
}
