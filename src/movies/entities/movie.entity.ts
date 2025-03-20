// src/movies/entities/movie.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Genre } from '../../genres/entities/genre.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  posterImage: string;

  @Column('int', { default: 0 })
  duration: number; // in minutes

  @ManyToMany(() => Genre, (genre) => genre.movies, { eager: true })
  @JoinTable({
    name: 'movies_genres',
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' },
  })
  genres: Genre[];

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
