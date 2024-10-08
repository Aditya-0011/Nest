import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { Users } from 'src/entities/user.entity';
import { Posts } from 'src/entities/post.entity';
import { Files } from 'src/entities/file.entity';

const ORM = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: 3306,
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASS'),
    database: configService.get<string>('DB_NAME'),
    entities: [Users, Posts, Files],
    synchronize: true,
  }),
  inject: [ConfigService],
});

export default ORM;
