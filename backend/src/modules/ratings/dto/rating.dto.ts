import { IsNotEmpty, IsNumber, IsPositive, Min, Max, IsString, IsOptional  } from "class-validator";
import { Type } from "class-transformer";

export class RatingDto {

    @IsNotEmpty({ message: 'Score is required' })
    @IsNumber({}, { message: 'Score must be a valid number' })
    @IsPositive({ message: 'Score must be a positive number' })
    @Type(() => Number)
    @Min(1, { message: 'Score must be at least 1' })
    @Max(5, { message: 'Score must be at most 5' })
    score: number;

    @IsString({ message: 'Comment must be a string' })
    @IsOptional()
    comment?: string;
}