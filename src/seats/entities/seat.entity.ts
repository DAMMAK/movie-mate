// src/seats/entities/seat.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';
import { Reservation } from '../../reservations/entites/reservation.entity';

export enum SeatStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
}

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  row: number;

  @Column()
  seatNumber: number;

  @Column({
    type: 'enum',
    enum: SeatStatus,
    default: SeatStatus.AVAILABLE,
  })
  status: SeatStatus;

  @ManyToOne(() => Showtime, (showtime) => showtime.seats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'showtime_id' })
  showtime: Showtime;

  @OneToMany(() => Reservation, (reservation) => reservation.seat)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
