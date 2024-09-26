import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/CreateUserDTO';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post('create')
  CreateUser(@Body(ValidationPipe) body: CreateUserDTO) {
    return this.service.create(body);
  }
}
