import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDTO } from './dto/CreateUserDTO';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly repo: Repository<Users>,
  ) {}

  async create(body: CreateUserDTO) {
    const { name, password, email } = body;
    try {
      const existingUsers = await this.repo.findBy({ email });
      if (existingUsers.length > 0) {
        throw new ConflictException('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = this.repo.create({ name, email, password: hashedPassword });
      await this.repo.save(user);
      return 'User created';
    } catch (e) {
      if (e instanceof ConflictException) {
        throw e;
      }

      throw new BadRequestException(e);
    }
  }
}
