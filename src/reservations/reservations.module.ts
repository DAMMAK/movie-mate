// src/reservations/reservations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entites/reservation.entity';
import { UsersModule } from '../users/users.module';
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { SeatsModule } from '../seats/seats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    UsersModule,
    ShowtimesModule,
    SeatsModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
