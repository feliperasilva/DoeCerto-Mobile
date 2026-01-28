import { PartialType } from '@nestjs/mapped-types';
import { CreateOngDto } from './create-ong.dto';
import { IsOptional, Matches, IsBoolean } from 'class-validator';

export class UpdateOngDto extends PartialType(CreateOngDto) {
  @IsOptional()
  @Matches(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, {
    message: 'CNPJ must be valid: XX.XXX.XXX/XXXX-XX or only digits',
  })
  cnpj?: string;

  @IsOptional()
  @IsBoolean({ message: 'isVerified must be a boolean value' })
  isVerified?: boolean;
}
