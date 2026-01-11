import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateOngProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsUrl({}, { message: 'O website deve ser uma URL válida' })
  websiteUrl?: string;
}