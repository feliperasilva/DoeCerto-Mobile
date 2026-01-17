import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import type { User } from 'generated/prisma';
import { UsersService } from 'src/modules/users/users.service';
import { DonorsService } from 'src/modules/donors/donors.service';
import { OngsService } from 'src/modules/ongs/ongs.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDonorDto } from './dto/register-donor.dto';
import { RegisterOngDto } from './dto/register-ong.dto';
import type { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  profile?: any;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly donorsService: DonorsService,
    private readonly ongsService: OngsService,
  ) {}

  async signIn(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    const userResponse = this.formatUserResponse(user);

    return { accessToken: token, user: userResponse };
  }

  async signUpDonor(registerDonorDto: RegisterDonorDto): Promise<AuthResponse> {
    await this.checkEmailAvailability(registerDonorDto.email);

    const { user: newUser, donor: newDonorProfile } =
      await this.donorsService.create(registerDonorDto);

    const token = this.generateToken(newUser);
    const userResponse = this.formatUserResponse(newUser);

    return {
      accessToken: token,
      user: userResponse,
      profile: newDonorProfile,
    };
  }

  async signUpOng(registerOngDto: RegisterOngDto): Promise<AuthResponse> {
    await this.checkEmailAvailability(registerOngDto.email);

    const { user: newUser, ong: newOngProfile } =
      await this.ongsService.create(registerOngDto);

    const token = this.generateToken(newUser);
    const userResponse = this.formatUserResponse(newUser);

    return {
      accessToken: token,
      user: userResponse,
      profile: newOngProfile,
    };
  }

  // Private helper methods
  private async checkEmailAvailability(email: string): Promise<void> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
  }

  private generateToken(user: User | UserResponseDto): string {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private formatUserResponse(user: User | UserResponseDto) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
