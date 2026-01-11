import { IsEmail, IsNotEmpty, Length, IsEnum } from 'class-validator';
import { Role } from 'generated/prisma';

export { Role as UserRole };

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 100, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsEnum(Role, { message: 'Role must be donor, ong, or admin' })
  role: Role;
}
