import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import JWT from 'src/utils/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Users } from 'src/entities/user.entity';

@Module({
  imports: [JWT, TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
