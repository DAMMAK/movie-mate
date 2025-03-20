// src/showtimes/showtimes.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ParseDatePipe } from '../common/pipes/parse-date.pipe';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.create(createShowtimeDto);
  }

  @Get()
  findAll() {
    return this.showtimesService.findAll();
  }

  @Get('upcoming')
  findUpcoming() {
    return this.showtimesService.findUpcoming();
  }

  @Get('date/:date')
  findByDate(@Param('date', ParseDatePipe) date: Date) {
    return this.showtimesService.findByDate(date);
  }

  @Get('movie/:movieId')
  findByMovie(@Param('movieId') movieId: string) {
    return this.showtimesService.findByMovie(movieId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    return this.showtimesService.update(id, updateShowtimeDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showtimesService.remove(id);
  }
}
