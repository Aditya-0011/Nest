import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AwsController } from './aws.controller';
import { AwsService } from './aws.service';
import { Files } from 'src/entities/file.entity';
import { Users } from 'src/entities/user.entity';

import JWT from 'src/utils/jwt';

@Module({
  imports: [JWT, TypeOrmModule.forFeature([Users, Files])],
  controllers: [AwsController],
  providers: [AwsService],
})
export class AwsModule {}
