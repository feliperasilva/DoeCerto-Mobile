import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateWhishlistDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
