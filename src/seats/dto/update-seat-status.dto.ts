import { IsEnum } from 'class-validator';
import { SeatStatus } from '../entities/seat.entity';

export class UpdateSeatStatusDto {
  @IsEnum(SeatStatus)
  status: SeatStatus;
}
