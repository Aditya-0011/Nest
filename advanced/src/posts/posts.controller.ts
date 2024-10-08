import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';

import { PostsService } from './posts.service';
import { CreatePostDto, DeletePostDto, UpdatePostDto } from './dto/post';
import { Req } from 'types';

@Controller('posts')
export class PostsController {
  constructor(private service: PostsService) {}

  @Get('test')
  Test() {
    return 'Posts controller works';
  }

  @UseGuards(AuthGuard)
  @Get('all')
  FetchAll(@Request() req: Req) {
    return this.service.getAll(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  Create(@Request() req: Req, @Body() data: CreatePostDto) {
    return this.service.create(req.user.sub, data);
  }

  @UseGuards(AuthGuard)
  @Post('update')
  Update(@Request() req: Req, @Body() data: UpdatePostDto) {
    return this.service.update(req.user.sub, data);
  }

  @UseGuards(AuthGuard)
  @Post('delete')
  Delete(@Request() req: Req, @Body() data: DeletePostDto) {
    return this.service.remove(req.user.sub, data);
  }
}
