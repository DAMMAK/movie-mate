// src/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReservationsService } from '../reservations/reservations.service';
import { ReportsService } from '../reports/reports.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private reservationsService: ReservationsService,
    private reportsService: ReportsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredReservations() {
    this.logger.log('Running cleanup of expired reservations');
    // In a real implementation, you would:
    // 1. Find all reservations for showtimes that have already passed
    // 2. Archive or delete them as needed
  }

  @Cron(CronExpression.EVERY_WEEK)
  async generateWeeklyReport() {
    this.logger.log('Generating weekly revenue report');

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    try {
      // Generate revenue report
      const revenueReport = await this.reportsService.getRevenueReport(
        startDate,
        endDate,
      );

      // Generate popular movies report
      const popularMovies = await this.reportsService.getPopularMoviesReport(
        startDate,
        endDate,
      );

      this.logger.log(
        `Weekly report generated successfully. Total revenue: ${revenueReport.revenueByDay
          .reduce((sum, day) => sum + parseFloat(day.totalRevenue), 0)
          .toFixed(2)}`,
      );

      // In a real app, you could email this report to admins or store it
      // await this.emailService.sendWeeklyReport(adminEmails, { revenueReport, popularMovies });
    } catch (error) {
      this.logger.error(`Failed to generate weekly report: ${error.message}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async generateDailyOccupancyReport() {
    this.logger.log('Generating daily occupancy report');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    try {
      const occupancyReport = await this.reportsService.getOccupancyReport(
        yesterday,
        new Date(),
      );

      // Calculate average occupancy
      const totalOccupancy = occupancyReport.occupancyByShowtime.reduce(
        (sum, showtime) => sum + parseFloat(showtime.occupancyPercentage),
        0,
      );
      const avgOccupancy =
        totalOccupancy / occupancyReport.occupancyByShowtime.length || 0;

      this.logger.log(
        `Daily occupancy report generated. Average occupancy: ${avgOccupancy.toFixed(2)}%`,
      );

      // In a real app, you could email this report to managers
      // await this.emailService.sendDailyOccupancyReport(managerEmails, { occupancyReport, avgOccupancy });
    } catch (error) {
      this.logger.error(
        `Failed to generate daily occupancy report: ${error.message}`,
      );
    }
  }
}
