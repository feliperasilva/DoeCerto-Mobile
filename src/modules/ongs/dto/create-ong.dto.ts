import {
  IsNotEmpty,
  Matches,
  IsOptional,
  IsBoolean,
  IsEmail,
  MinLength,
} from 'class-validator';

export class CreateOngDto {
  // Campos do usuário
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  // Campos da ONG
  @IsNotEmpty({ message: 'CNPJ is required' })
  @Matches(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, {
    message: 'CNPJ must be valid: XX.XXX.XXX/XXXX-XX or only digits',
  })
  cnpj: string;

  @IsOptional()
  @IsBoolean({ message: 'isVerified must be a boolean value' })
  isVerified?: boolean = false;
}
