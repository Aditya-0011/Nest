import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';

const JWT = JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '1h' },
  }),
  inject: [ConfigService],
});

export default JWT;
