import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationsService.create(user.id, createReservationDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get('my-reservations')
  findByUser(@CurrentUser() user) {
    return this.reservationsService.findByUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-upcoming-reservations')
  findUpcomingByUser(@CurrentUser() user) {
    return this.reservationsService.findUpcomingByUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateReservationStatusDto: UpdateReservationStatusDto,
  ) {
    return this.reservationsService.updateStatus(
      id,
      updateReservationStatusDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user) {
    return this.reservationsService.cancel(id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('stats/all')
  getReservationStats() {
    return this.reservationsService.getReservationStats();
  }
}
