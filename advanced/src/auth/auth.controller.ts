import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('signup')
  Signup(@Body(ValidationPipe) data: SignupDto) {
    return this.service.signup(data);
  }

  @Post('login')
  Login(@Body(ValidationPipe) data: LoginDto) {
    return this.service.login(data);
  }
}
