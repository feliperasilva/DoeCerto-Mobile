import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { RegisterDonorDto } from './dto/register-donor.dto';
import { DonorsService } from 'src/donors/donors.service';
import { OngsService } from 'src/ongs/ongs.service';
import { RegisterOngDto } from './dto/register-ong.dto';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService, private donorsService: DonorsService, private ongsService: OngsService) {}

    async signIn(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const payload = { sub: user.id, name: user.name, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);

        const userResponse = { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role 
        };
        
        return { accessToken: token, user: userResponse };
    }

    async signUpDonor(registerDonorDto: RegisterDonorDto) {

        const existingUser = await this.usersService.findByEmail(registerDonorDto.email);
        if (existingUser) {
            throw new ConflictException('Email already in use'); 
        }

        const { user: newUser, donor: newDonorProfile } = await this.donorsService.create(registerDonorDto);
        
        const payload = { sub: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
        const token = this.jwtService.sign(payload);
        
        const userResponse = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
        
         return { 
            accessToken: token,
            user: userResponse,
            profile: newDonorProfile
        };
    }

    async signUpOng(registerOngDto: RegisterOngDto) {

        const existingUser = await this.usersService.findByEmail(registerOngDto.email);
        if (existingUser) {
            throw new ConflictException('Email already in use'); 
        }

        const { user: newUser, ong: newOngProfile } = await this.ongsService.create(registerOngDto);
        
        const payload = { sub: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
        const token = this.jwtService.sign(payload);
        
        const userResponse = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
        
         return { 
            accessToken: token,
            user: userResponse,
            profile: newOngProfile
        };
    }
    
}
