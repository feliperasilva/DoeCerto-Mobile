import { IsOptional, IsEnum, IsString, IsInt } from 'class-validator';

export enum DonationStatus {
  PENDING = 'pending',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

export class UpdateDonationDto {

  @IsOptional()
  @IsEnum(DonationStatus)
  status?: DonationStatus; 

  @IsOptional()
  @IsString()
  materialDescription?: string;

  @IsOptional()
  @IsInt()
  materialQuantity?: number;

}