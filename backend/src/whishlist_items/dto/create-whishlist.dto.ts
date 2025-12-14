import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateWhishlistDto {
  @IsInt()
  ongId: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
