import { Type } from 'class-transformer';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsPositive,
  IsNumber,
} from 'class-validator';
import { DonationStatus } from 'generated/prisma';

export { DonationStatus };

export class UpdateDonationDto {
  @IsOptional()
  @IsEnum(DonationStatus)
  donationStatus?: DonationStatus;

  @IsOptional()
  @IsString()
  materialDescription?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  materialQuantity?: number;
}
