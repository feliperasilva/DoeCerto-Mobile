import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 100)
  password: string;
}
