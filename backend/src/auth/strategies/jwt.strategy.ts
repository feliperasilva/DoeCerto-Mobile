import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { User } from 'generated/prisma'; // Importando o tipo do Prisma

// ... (Função cookieExtractor está correta)
const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies['access_token'] || null;
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { 
  constructor(
    private readonly usersService: UsersService, 
    private readonly configService: ConfigService, 
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: { sub: string; email: string; role: string }): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Token inválido ou usuário não encontrado.');
    }

    // Remove dados sensíveis (como a senha) do objeto
    const { password, ...result } = user;
    return result; // Retorna o usuário sem a senha
  }
}