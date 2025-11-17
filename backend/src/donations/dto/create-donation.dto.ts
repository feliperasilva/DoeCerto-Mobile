import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEnum,
  ValidateIf,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export enum DonationType {
  MONETARY = 'monetary',
  MATERIAL = 'material',
}

export class CreateDonationDto {
  @IsNotEmpty({ message: 'ONG ID is required' })
  @IsNumber({}, { message: 'ONG ID must be a valid number' })
  @IsPositive({ message: 'ONG ID must be a positive number' })
  @Type(() => Number)
  ongId: number;

  @IsNotEmpty({ message: 'Donation type is required' })
  @IsEnum(DonationType, {
    message: 'Donation type must be either MONETARY or MATERIAL',
  })
  donationType: DonationType;

  // Campos para doações monetárias

  @ValidateIf((o) => o.donationType === DonationType.MONETARY)
  @IsNotEmpty({ message: 'Monetary amount is required for monetary donations' })
  @IsNumber({}, { message: 'Monetary amount must be a valid number' })
  @IsPositive({ message: 'Monetary amount must be a positive number' })
  @Type(() => Number)
  monetaryAmount?: number;

  @ValidateIf((o) => o.donationType === DonationType.MONETARY)
  @IsNotEmpty({
    message: 'Monetary currency is required for monetary donations',
  })
  @IsString({ message: 'Monetary currency must be a string' })
  @Length(3, 3, {
    message: 'Monetary currency must be a valid 3-letter currency code',
  })
  monetaryCurrency?: string;

  // Campos para doações materiais

  @ValidateIf((o) => o.donationType === DonationType.MATERIAL)
  @IsNotEmpty({
    message: 'Material description is required for material donations',
  })
  @IsString({ message: 'Material description must be a string' })
  materialDescription?: string;

  @ValidateIf((o) => o.donationType === DonationType.MATERIAL)
  @IsNotEmpty({
    message: 'Material quantity is required for material donations',
  })
  @IsNumber({}, { message: 'Material quantity must be a valid number' })
  @IsPositive({ message: 'Material quantity must be a positive number' })
  @Type(() => Number)
  materialQuantity?: number;
}
