import { IsEmail, IsNotEmpty, Length, IsEnum } from 'class-validator';

export enum UserRole {
  DONOR = 'donor',
  ONG = 'ong',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 100, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsEnum(UserRole, { message: 'Role must be donor, ong, or admin' })
  role: UserRole;
}
