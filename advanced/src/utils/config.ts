import { ConfigModule } from '@nestjs/config';

const CONFIG = ConfigModule.forRoot({ isGlobal: true });

export default CONFIG;
