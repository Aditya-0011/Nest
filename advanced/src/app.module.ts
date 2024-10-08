import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { AwsModule } from './aws/aws.module';
import ORM from './utils/db';
import CONFIG from './utils/config';

@Module({
  imports: [CONFIG, ORM, AuthModule, PostsModule, AwsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
