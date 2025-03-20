import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  IsUrl,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  posterImage: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsArray()
  @IsOptional()
  genreIds: string[];
}
