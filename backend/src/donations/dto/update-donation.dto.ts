import { Type } from 'class-transformer';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsPositive,
  IsNumber,
} from 'class-validator';

export enum DonationStatus {
  PENDING = 'pending',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

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
