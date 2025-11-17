import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import type { User } from 'generated/prisma';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDonorDto } from './dto/register-donor.dto';
import { RegisterOngDto } from './dto/register-ong.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  private readonly TOKEN_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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
  @HttpCode(HttpStatus.CREATED)
  async signUpDonor(
    @Body() registerDonorDto: RegisterDonorDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } =
      await this.authService.signUpDonor(registerDonorDto);
    this.setTokenCookie(response, accessToken);
    return { message: 'Donor registered successfully' };
  }

  @Post('register/ong')
  @HttpCode(HttpStatus.CREATED)
  async signUpOng(
    @Body() registerOngDto: RegisterOngDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } = await this.authService.signUpOng(registerOngDto);
    this.setTokenCookie(response, accessToken);
    return { message: 'ONG registered successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logout successful' };
  }

  private setTokenCookie(response: Response, accessToken: string): void {
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + this.TOKEN_EXPIRY),
    });
  }
}
