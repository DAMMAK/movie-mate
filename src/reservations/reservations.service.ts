import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThanOrEqual } from 'typeorm';
import { Reservation, ReservationStatus } from './entites/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { UsersService } from '../users/users.service';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { SeatsService } from '../seats/seats.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    private usersService: UsersService,
    private showtimesService: ShowtimesService,
    private seatsService: SeatsService,
  ) {}

  async create(
    userId: string,
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation[]> {
    const { showtimeId, seatIds } = createReservationDto;

    const user = await this.usersService.findOne(userId);
    const showtime = await this.showtimesService.findOne(showtimeId);

    // Check if showtime is in the future
    if (new Date(showtime.startTime) <= new Date()) {
      throw new BadRequestException('Cannot reserve seats for past showtimes');
    }

    // Reserve seats (this will throw an error if seats are not available)
    const seats = await this.seatsService.reserveSeats(seatIds);

    // Create a reservation for each seat
    const reservations: Reservation[] = [];

    for (const seat of seats) {
      const reservation = this.reservationsRepository.create({
        user,
        showtime,
        seat,
        totalPrice: showtime.price,
        status: ReservationStatus.ACTIVE,
      });

      reservations.push(await this.reservationsRepository.save(reservation));
    }

    return reservations;
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      relations: ['user', 'showtime', 'showtime.movie', 'seat'],
    });
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: ['user', 'showtime', 'showtime.movie', 'seat'],
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return reservation;
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      where: { user: { id: userId } },
      relations: ['showtime', 'showtime.movie', 'seat'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findUpcomingByUser(userId: string): Promise<Reservation[]> {
    const now = new Date();

    return this.reservationsRepository.find({
      where: {
        user: { id: userId },
        showtime: { startTime: MoreThanOrEqual(now) },
        status: ReservationStatus.ACTIVE,
      },
      relations: ['showtime', 'showtime.movie', 'seat'],
      order: {
        showtime: {
          startTime: 'ASC',
        },
      },
    });
  }

  async updateStatus(
    id: string,
    updateReservationStatusDto: UpdateReservationStatusDto,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);

    // If cancelling, release the seat
    if (
      updateReservationStatusDto.status === ReservationStatus.CANCELLED &&
      reservation.status === ReservationStatus.ACTIVE
    ) {
      await this.seatsService.releaseSeats([reservation.seat.id]);
    }

    reservation.status = updateReservationStatusDto.status;

    return this.reservationsRepository.save(reservation);
  }

  async cancel(id: string, userId: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    // Check if reservation belongs to user
    if (reservation.user.id !== userId) {
      throw new BadRequestException(
        'You can only cancel your own reservations',
      );
    }

    // Check if reservation is active
    if (reservation.status !== ReservationStatus.ACTIVE) {
      throw new BadRequestException(
        'Only active reservations can be cancelled',
      );
    }

    // Check if showtime is in the future
    if (new Date(reservation.showtime.startTime) <= new Date()) {
      throw new BadRequestException(
        'Cannot cancel reservations for past showtimes',
      );
    }

    return this.updateStatus(id, { status: ReservationStatus.CANCELLED });
  }

  async getReservationStats() {
    // Get total reservations
    const totalReservations = await this.reservationsRepository.count({
      where: { status: ReservationStatus.ACTIVE },
    });

    // Get total revenue
    const revenue = await this.reservationsRepository
      .createQueryBuilder('reservation')
      .select('SUM(reservation.totalPrice)', 'total')
      .where('reservation.status = :status', {
        status: ReservationStatus.ACTIVE,
      })
      .getRawOne();

    // Get reservations by movie
    const reservationsByMovie = await this.reservationsRepository
      .createQueryBuilder('reservation')
      .select('movie.title', 'movieTitle')
      .addSelect('COUNT(reservation.id)', 'count')
      .addSelect('SUM(reservation.totalPrice)', 'revenue')
      .leftJoin('reservation.showtime', 'showtime')
      .leftJoin('showtime.movie', 'movie')
      .where('reservation.status = :status', {
        status: ReservationStatus.ACTIVE,
      })
      .groupBy('movie.id')
      .getRawMany();

    return {
      totalReservations,
      totalRevenue: revenue.total || 0,
      reservationsByMovie,
    };
  }
}
