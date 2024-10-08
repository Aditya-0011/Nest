import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostDto, DeletePostDto, UpdatePostDto } from './dto/post';
import { Posts } from 'src/entities/post.entity';
import { Users } from 'src/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postRepo: Repository<Posts>,
    @InjectRepository(Users)
    private userRepo: Repository<Users>,
  ) {}

  async create(userId: number, data: CreatePostDto) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      const newPost = this.postRepo.create({ ...data, user });
      await this.postRepo.save(newPost);
      return 'Post created';
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async update(userId: number, data: UpdatePostDto) {
    try {
      const post = await this.postRepo.findOneBy({
        id: data.id,
        user: { id: userId },
      });
      if (!post) {
        throw new BadRequestException('Post not found');
      }
      await this.postRepo.update(post, { ...data });
      return 'Post updated';
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getAll(id: number) {
    return {
      data: await this.postRepo.find({
        where: { user: { id } },
      }),
    };
  }

  async remove(userId: number, data: DeletePostDto) {
    try {
      const post = await this.postRepo.findOneBy({
        id: data.id,
        user: { id: userId },
      });
      if (!post) {
        throw new BadRequestException('Post not found');
      }
      await this.postRepo.remove(post);
      return 'Post deleted';
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
