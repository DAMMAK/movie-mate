import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { UpdateSeatStatusDto } from './dto/update-seat-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get('showtime/:showtimeId')
  findByShowtime(@Param('showtimeId') showtimeId: string) {
    return this.seatsService.findByShowtime(showtimeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seatsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateSeatStatusDto: UpdateSeatStatusDto,
  ) {
    return this.seatsService.updateStatus(id, updateSeatStatusDto);
  }
}
