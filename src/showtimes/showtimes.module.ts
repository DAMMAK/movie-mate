import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { MoviesModule } from '../movies/movies.module';
import { SeatsModule } from '../seats/seats.module';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime]), MoviesModule, SeatsModule],
  providers: [ShowtimesService],
  controllers: [ShowtimesController],
  exports: [ShowtimesService],
})
export class ShowtimesModule {}
