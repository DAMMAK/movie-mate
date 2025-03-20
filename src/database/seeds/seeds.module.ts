// seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seeds.service';
import { User } from '../../users/entities/user.entity';
import { Genre } from '../../genres/entities/genre.entity';
import { Movie } from '../../movies/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Genre, Movie])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedsModule {}
