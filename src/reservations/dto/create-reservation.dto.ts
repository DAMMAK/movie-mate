import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  @IsNotEmpty()
  showtimeId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  seatIds: string[];
}
