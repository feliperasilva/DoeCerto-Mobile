// src/catalog/dto/get-catalog.dto.ts
import { IsOptional, IsArray, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetCatalogDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v) => parseInt(v.trim(), 10));
    }
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === 'string' ? parseInt(v, 10) : v));
    }
    return value;
  })
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value, 10) : value))
  offset?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value, 10) : value))
  limit?: number;
}