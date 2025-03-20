import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShowtimeDto {
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsNumber()
  @Min(0)
  price: number;

  @IsUUID()
  @IsNotEmpty()
  movieId: string;

  @IsNumber()
  @Min(1)
  rows: number;

  @IsNumber()
  @Min(1)
  seatsPerRow: number;
}
