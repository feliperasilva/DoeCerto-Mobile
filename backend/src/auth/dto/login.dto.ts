import { IsEmail, IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email should not be empty' })
    @MaxLength(254, { message: 'Email is too long' }) 
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password should not be empty' })
    @MaxLength(128, { message: 'Password is too long' }) 
    password: string;
}
