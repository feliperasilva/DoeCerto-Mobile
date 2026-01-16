import { PartialType } from '@nestjs/mapped-types';
import { CreateDonorDto } from './create-donor.dto';
import { IsOptional, Matches } from 'class-validator';

export class UpdateDonorDto extends PartialType(CreateDonorDto) {
  @IsOptional()
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
    message: 'CPF must be valid: XXX.XXX.XXX-XX or only digits',
  })
  cpf?: string;
}
