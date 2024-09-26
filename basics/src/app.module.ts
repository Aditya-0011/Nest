import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Users } from './users/users.entity';

const CONFIG = ConfigModule.forRoot();

const ORM = TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST as string,
  port: 3306,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,
  entities: [Users],
  //synchronize: true,
});

@Module({
  imports: [CONFIG, ORM, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
