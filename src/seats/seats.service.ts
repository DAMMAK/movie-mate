import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Seat, SeatStatus } from './entities/seat.entity';
import { UpdateSeatStatusDto } from './dto/update-seat-status.dto';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private seatsRepository: Repository<Seat>,
  ) {}

  async createSeatsForShowtime(
    showtimeId: string,
    rows: number,
    seatsPerRow: number,
  ): Promise<void> {
    var seats: Seat[] = [];

    for (let row = 1; row <= rows; row++) {
      for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
        var _seat: Seat = this.seatsRepository.create({
          row,
          seatNumber,
          status: SeatStatus.AVAILABLE,
          showtime: { id: showtimeId },
        });
        seats.push(_seat);
      }
    }

    await this.seatsRepository.save(seats);
  }

  async findByShowtime(showtimeId: string): Promise<Seat[]> {
    return this.seatsRepository.find({
      where: { showtime: { id: showtimeId } },
      order: {
        row: 'ASC',
        seatNumber: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Seat> {
    const seat = await this.seatsRepository.findOne({
      where: { id },
      relations: ['showtime'],
    });

    if (!seat) {
      throw new NotFoundException(`Seat with ID ${id} not found`);
    }

    return seat;
  }

  async updateStatus(
    id: string,
    updateSeatStatusDto: UpdateSeatStatusDto,
  ): Promise<Seat> {
    const seat = await this.findOne(id);

    seat.status = updateSeatStatusDto.status;

    return this.seatsRepository.save(seat);
  }

  async reserveSeats(seatIds: string[]): Promise<Seat[]> {
    const seats = await this.seatsRepository.find({
      where: { id: In(seatIds) },
    });

    if (seats.length !== seatIds.length) {
      throw new NotFoundException('One or more seats not found');
    }

    // Check if all seats are available
    const unavailableSeats = seats.filter(
      (seat) => seat.status !== SeatStatus.AVAILABLE,
    );
    if (unavailableSeats.length > 0) {
      throw new BadRequestException(
        `Seats ${unavailableSeats.map((s) => `Row ${s.row}, Seat ${s.seatNumber}`).join(', ')} are not available`,
      );
    }

    // Update status to reserved
    seats.forEach((seat) => {
      seat.status = SeatStatus.RESERVED;
    });

    return this.seatsRepository.save(seats);
  }

  async releaseSeats(seatIds: string[]): Promise<Seat[]> {
    const seats = await this.seatsRepository.find({
      where: { id: In(seatIds) },
    });

    if (seats.length !== seatIds.length) {
      throw new NotFoundException('One or more seats not found');
    }

    // Update status to available
    seats.forEach((seat) => {
      seat.status = SeatStatus.AVAILABLE;
    });

    return this.seatsRepository.save(seats);
  }
}
