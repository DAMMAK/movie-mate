import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Seat } from '../../seats/entities/seat.entity';
import { Reservation } from '../../reservations/entites/reservation.entity';

@Entity('showtimes')
export class Showtime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ default: 0 })
  price: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @OneToMany(() => Seat, (seat) => seat.showtime, { cascade: true })
  seats: Seat[];

  @OneToMany(() => Reservation, (reservation) => reservation.showtime)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
