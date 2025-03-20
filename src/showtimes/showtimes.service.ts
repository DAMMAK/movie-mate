// src/showtimes/showtimes.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { MoviesService } from '../movies/movies.service';
import { SeatsService } from '../seats/seats.service';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private showtimesRepository: Repository<Showtime>,
    private moviesService: MoviesService,
    private seatsService: SeatsService,
  ) {}

  async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    const { movieId, startTime, price, rows, seatsPerRow } = createShowtimeDto;

    const movie = await this.moviesService.findOne(movieId);

    // Calculate end time based on movie duration
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + movie.duration);

    const showtime = this.showtimesRepository.create({
      startTime,
      endTime,
      price,
      movie,
    });

    const savedShowtime = await this.showtimesRepository.save(showtime);

    // Create seats for the showtime
    await this.seatsService.createSeatsForShowtime(
      savedShowtime.id,
      rows,
      seatsPerRow,
    );

    return this.findOne(savedShowtime.id);
  }

  async findAll(): Promise<Showtime[]> {
    return this.showtimesRepository.find({
      relations: ['movie'],
    });
  }

  async findOne(id: string): Promise<Showtime> {
    const showtime = await this.showtimesRepository.findOne({
      where: { id },
      relations: ['movie', 'seats'],
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }

    return showtime;
  }

  async update(
    id: string,
    updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<Showtime> {
    const showtime = await this.findOne(id);

    if (updateShowtimeDto.movieId) {
      const movie = await this.moviesService.findOne(updateShowtimeDto.movieId);
      showtime.movie = movie;

      // Update end time if movie changed
      if (updateShowtimeDto.startTime || movie.id !== showtime.movie.id) {
        const startTime = updateShowtimeDto.startTime
          ? new Date(updateShowtimeDto.startTime)
          : showtime.startTime;
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + movie.duration);
        showtime.endTime = endTime;
      }
    }

    if (updateShowtimeDto.startTime && !updateShowtimeDto.movieId) {
      // Update end time if only start time changed
      const startTime = new Date(updateShowtimeDto.startTime);
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + showtime.movie.duration);

      showtime.startTime = startTime;
      showtime.endTime = endTime;
    }

    if (updateShowtimeDto.price !== undefined) {
      showtime.price = updateShowtimeDto.price;
    }

    return this.showtimesRepository.save(showtime);
  }

  async remove(id: string): Promise<void> {
    const result = await this.showtimesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }
  }

  // src/showtimes/showtimes.service.ts (continued)
  async findByDate(date: Date): Promise<Showtime[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.showtimesRepository.find({
      where: {
        startTime: Between(startOfDay, endOfDay),
      },
      relations: ['movie'],
      order: {
        startTime: 'ASC',
      },
    });
  }

  async findUpcoming(): Promise<Showtime[]> {
    const now = new Date();

    return this.showtimesRepository.find({
      where: {
        startTime: MoreThanOrEqual(now),
      },
      relations: ['movie'],
      order: {
        startTime: 'ASC',
      },
    });
  }

  async findByMovie(movieId: string): Promise<Showtime[]> {
    return this.showtimesRepository.find({
      where: {
        movie: { id: movieId },
      },
      relations: ['movie'],
      order: {
        startTime: 'ASC',
      },
    });
  }
}
