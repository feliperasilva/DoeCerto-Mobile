import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import type { User } from 'generated/prisma';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    const jwtSecret = ConfigService.prototype.constructor;
    super({
      // ✅ Forma simples: apenas cookie
      jwtFromRequest: (req: Request) => {
        if (req?.cookies) {
          return req.cookies['Authorization'] || req.cookies['access_token'] || null;
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role: string;
  }): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Token inválido ou usuário não encontrado');
    }

    console.log('🔍 JWT Strategy - Usuário validado:', {
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password, ...result } = user;
    return result;
  }
}
