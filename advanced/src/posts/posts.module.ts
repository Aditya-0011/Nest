import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Posts } from 'src/entities/post.entity';
import { Users } from 'src/entities/user.entity';

import JWT from 'src/utils/jwt';

@Module({
  imports: [JWT, TypeOrmModule.forFeature([Posts, Users])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
