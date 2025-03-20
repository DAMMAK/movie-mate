import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Genre } from '../genres/entities/genre.entity';

import { GenresController } from '../genres/genres.controller';
import { GenresService } from '../genres/genres.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Genre])],
  providers: [MoviesService, MoviesService, GenresService],
  controllers: [MoviesController, MoviesController, GenresController],
  exports: [MoviesService, GenresService],
})
export class MoviesModule {}
