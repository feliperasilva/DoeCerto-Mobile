import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokenDto {
  @IsNotEmpty({ message: 'Token is required' })
  @IsString()
  token: string;
}
