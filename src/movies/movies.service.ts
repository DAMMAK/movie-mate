// src/movies/movies.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { GenresService } from 'src/genres/genres.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private genresService: GenresService,
  ) {}

  async findAll(genre?: string): Promise<Movie[]> {
    const cacheKey = `movies_${genre || 'all'}`;
    const cachedMovies = await this.cacheManager.get<Movie[]>(cacheKey);

    if (cachedMovies) {
      return cachedMovies;
    }

    const queryBuilder = this.moviesRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre');

    if (genre) {
      queryBuilder.where('genre.name = :genre', { genre });
    }

    const movies = await queryBuilder.getMany();
    await this.cacheManager.set(cacheKey, movies);

    return movies;
  }

  async findOne(id: string): Promise<Movie> {
    const cacheKey = `movie_${id}`;
    const cachedMovie = await this.cacheManager.get<Movie>(cacheKey);

    if (cachedMovie) {
      return cachedMovie;
    }

    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['genres', 'showtimes'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    await this.cacheManager.set(cacheKey, movie);

    return movie;
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { genreIds, ...movieData } = createMovieDto;

    const movie = this.moviesRepository.create(movieData);

    if (genreIds && genreIds.length > 0) {
      movie.genres = [];
      for (const genreId of genreIds) {
        const genre = await this.genresService.findOne(genreId);
        movie.genres.push(genre);
      }
    }

    const _movie = await this.moviesRepository.save(createMovieDto);

    await this.cacheManager.del('movies_all');
    return _movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);

    const { genreIds, ...movieData } = updateMovieDto;

    if (genreIds) {
      movie.genres = [];
      for (const genreId of genreIds) {
        const genre = await this.genresService.findOne(genreId);
        movie.genres.push(genre);
      }
    }

    this.moviesRepository.merge(movie, movieData);
    var updated = this.moviesRepository.save(movie);

    // // Invalidate caches
    await this.cacheManager.del(`movie_${id}`);
    await this.cacheManager.del('movies_all');

    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.moviesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    // Invalidate caches
    await this.cacheManager.del(`movie_${id}`);
    await this.cacheManager.del('movies_all');
  }

  async updatePoster(id: string, posterUrl: string): Promise<Movie> {
    const movie = await this.findOne(id);
    movie.posterImage = posterUrl;

    const updated = await this.moviesRepository.save(movie);

    // Invalidate caches
    await this.cacheManager.del(`movie_${id}`);
    await this.cacheManager.del('movies_all');

    return updated;
  }

  async findByGenre(genreId: string): Promise<Movie[]> {
    return this.moviesRepository
      .createQueryBuilder('movie')
      .innerJoin('movie.genres', 'genre')
      .where('genre.id = :genreId', { genreId })
      .getMany();
  }
}
