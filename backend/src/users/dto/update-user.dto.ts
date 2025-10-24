import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, Length, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsOptional()
  @Length(6, 100, { message: 'Password must be at least 6 characters' })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be donor, ong, or admin' })
  role?: UserRole;
}
