import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDonorDto } from './dto/register-donor.dto';
import { RegisterOngDto } from './dto/register-ong.dto';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { User } from 'generated/prisma';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } = await this.authService.signIn(loginDto);
    this.setTokenCookie(response, accessToken);
    return { message: 'Login successful' };
  }

  @Post('register/donor')
  async signUpDonor(
    @Body() registerDonorDto: RegisterDonorDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } = await this.authService.signUpDonor(registerDonorDto);
    this.setTokenCookie(response, accessToken); 
    return { message: 'Donor registered successfully' };
  }

  @Post('register/ong')
  async signUpOng(
    @Body() registerOngDto: RegisterOngDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } = await this.authService.signUpOng(registerOngDto);
    this.setTokenCookie(response, accessToken); 
    return { message: 'Ong registered successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logout bem-sucedido' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('donor')
  @Get('donor-panel')
  getDonorAdminPanel(@CurrentUser() user: User) {
  return { message: `Bem-vindo, ${user.name} (Doador).` };
}

  private setTokenCookie(response: Response, accessToken: string) {

    const expiresIn = 1000 * 60 * 60 * 24; 

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + expiresIn),
    });
  }
}
