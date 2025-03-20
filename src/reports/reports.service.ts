import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {
  Reservation,
  ReservationStatus,
} from '../reservations/entites/reservation.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
  ) {}

  async getRevenueReport(startDate: Date, endDate: Date) {
    const revenueByDay = await this.reservationsRepository
      .createQueryBuilder('reservation')
      .select('DATE(reservation.createdAt)', 'date')
      .addSelect('SUM(reservation.totalPrice)', 'revenue')
      .where('reservation.status = :status', {
        status: ReservationStatus.ACTIVE,
      })
      .andWhere('reservation.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('DATE(reservation.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    const totalRevenue = revenueByDay.reduce(
      (sum, item) => sum + parseFloat(item.revenue),
      0,
    );

    return {
      totalRevenue,
      revenueByDay,
    };
  }

  async getOccupancyReport(startDate: Date, endDate: Date) {
    const occupancyByShowtime = await this.reservationsRepository
      .createQueryBuilder('reservation')
      .select('showtime.id', 'showtimeId')
      .addSelect('movie.title', 'movieTitle')
      .addSelect('showtime.startTime', 'startTime')
      .addSelect('COUNT(reservation.id)', 'reservedSeats')
      .addSelect('COUNT(seat.id)', 'totalSeats')
      .addSelect(
        'ROUND((COUNT(reservation.id)::float / COUNT(seat.id)::float) * 100, 2)',
        'occupancyRate',
      )
      .leftJoin('reservation.showtime', 'showtime')
      .leftJoin('showtime.movie', 'movie')
      .leftJoin('showtime.seats', 'seat')
      .where('showtime.startTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('reservation.status = :status', {
        status: ReservationStatus.ACTIVE,
      })
      .groupBy('showtime.id')
      .addGroupBy('movie.title')
      .addGroupBy('showtime.startTime')
      .orderBy('showtime.startTime', 'ASC')
      .getRawMany();

    const averageOccupancy = occupancyByShowtime.length
      ? occupancyByShowtime.reduce(
          (sum, item) => sum + parseFloat(item.occupancyRate),
          0,
        ) / occupancyByShowtime.length
      : 0;

    return {
      averageOccupancy,
      occupancyByShowtime,
    };
  }

  async getPopularMoviesReport(startDate: Date, endDate: Date) {
    return this.reservationsRepository
      .createQueryBuilder('reservation')
      .select('movie.id', 'movieId')
      .addSelect('movie.title', 'movieTitle')
      .addSelect('COUNT(reservation.id)', 'reservationsCount')
      .addSelect('SUM(reservation.totalPrice)', 'revenue')
      .leftJoin('reservation.showtime', 'showtime')
      .leftJoin('showtime.movie', 'movie')
      .where('showtime.startTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('reservation.status = :status', {
        status: ReservationStatus.ACTIVE,
      })
      .groupBy('movie.id')
      .addGroupBy('movie.title')
      .orderBy('reservationsCount', 'DESC')
      .getRawMany();
  }
}
