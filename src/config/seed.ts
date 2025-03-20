import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { Connection } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Genre } from '../genres/entities/genre.entity';
import { Movie } from '../movies/entities/movie.entity';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

async function bootstrap() {
  const logger = new Logger('Seed');
  const app = await NestFactory.createApplicationContext(AppModule);
  const connection = app.get(Connection);

  try {
    logger.log('Seeding database...');

    // Create admin user
    const userRepository = connection.getRepository(User);
    const adminExists = await userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!adminExists) {
      logger.log('Creating admin user...');
      const hashedPassword = await bcrypt.hash('password123', 10);

      await userRepository.save({
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
      });

      logger.log('Admin user created');
    }

    // Create genres
    const genreRepository = connection.getRepository(Genre);
    const genres = [
      'Action',
      'Adventure',
      'Comedy',
      'Drama',
      'Horror',
      'Sci-Fi',
      'Thriller',
      'Romance',
    ];

    for (const genreName of genres) {
      const genreExists = await genreRepository.findOne({
        where: { name: genreName },
      });

      if (!genreExists) {
        await genreRepository.save({ name: genreName });
        logger.log(`Genre ${genreName} created`);
      }
    }

    // Create sample movies with genres
    const movieRepository = connection.getRepository(Movie);
    const allGenres = await genreRepository.find();

    const movies: Movie[] = [
      {
        id: uuidv4(),
        title: 'The Dark Knight',
        description: 'Batman fights against the Joker in Gotham City.',
        posterImage: 'https://example.com/dark-knight.jpg',
        duration: 152,
        genres: [
          allGenres.find((g) => g.name === 'Action') as Genre,
          allGenres.find((g) => g.name === 'Drama') as Genre,
          allGenres.find((g) => g.name === 'Thriller') as Genre,
        ],
        showtimes: [], // Assuming showtimes is an array, you can keep it empty
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: 'Inception',
        description:
          'A thief who enters the dreams of others to steal their secrets.',
        posterImage: 'https://example.com/inception.jpg',
        duration: 148,
        genres: [
          allGenres.find((g) => g.name === 'Action') as Genre,
          allGenres.find((g) => g.name === 'Sci-Fi') as Genre,
          allGenres.find((g) => g.name === 'Thriller') as Genre,
        ],
        showtimes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: 'The Shawshank Redemption',
        description:
          'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        posterImage: 'https://example.com/shawshank.jpg',
        duration: 142,
        genres: [allGenres.find((g) => g.name === 'Drama') as Genre],
        showtimes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const movieData of movies) {
      const movieExists = await movieRepository.findOne({
        where: { title: movieData.title },
      });

      if (!movieExists) {
        await movieRepository.save(movieData);
        logger.log(`Movie ${movieData.title} created`);
      }
    }

    logger.log('Seeding completed');
  } catch (error) {
    logger.error('Seeding failed', error);
  } finally {
    await app.close();
  }
}

bootstrap();
