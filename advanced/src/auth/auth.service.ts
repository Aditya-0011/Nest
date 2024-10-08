import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { SignupDto, LoginDto } from './dto/auth';
import { Users } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private repo: Repository<Users>,
    private jwt: JwtService,
  ) {}

  async signup(data: SignupDto) {
    const { email, name, password } = data;
    try {
      const existingUser = await this.repo.findBy({ email });

      if (existingUser.length > 0) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = this.repo.create({
        name,
        email,
        password: hashedPassword,
      });
      await this.repo.save(user);
      return 'Signup successful';
    } catch (e) {
      if (e instanceof ConflictException) {
        throw e;
      }

      throw new BadRequestException(e);
    }
  }

  async login(data: LoginDto): Promise<{ token: string }> {
    const { email, password } = data;
    try {
      const user = await this.repo.findOneBy({ email });

      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid email or password');
      }

      const payload = { sub: user.id, username: user.email };
      return { token: await this.jwt.signAsync(payload) };
    } catch (e) {
      throw new BadRequestException(e.response);
    }
  }
}
