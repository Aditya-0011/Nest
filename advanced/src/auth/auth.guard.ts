import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  private extractToken(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractToken(req);

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const payload = this.jwt.verify(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      req.user = payload;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}
