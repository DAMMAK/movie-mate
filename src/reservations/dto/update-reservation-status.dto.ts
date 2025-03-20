import { IsEnum } from 'class-validator';
import { ReservationStatus } from '../entites/reservation.entity';

export class UpdateReservationStatusDto {
  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}
