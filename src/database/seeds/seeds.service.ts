// src/database/seeds/seed.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import { Genre } from '../../genres/entities/genre.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { Seat } from '../../seats/entities/seat.entity';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { NestFactory } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

// @Injectable()
// export class SeedService {
//   constructor(private dataSource: DataSource) {}

//   // async seed() {
//   //   await this.seedUsers();
//   //   await this.seedGenres();
//   //   await this.seedMovies();
//   //   await this.seedTheaters();
//   //   await this.seedSeatCategories();
//   //   await this.seedSeats();
//   // }

//   // private async seedUsers() {
//   //   const userRepository = this.dataSource.getRepository(User);

//   //   // Check if admin already exists
//   //   const adminExists = await userRepository.findOne({
//   //     where: { email: 'admin@example.com' },
//   //   });
//   //   if (adminExists) {
//   //     return;
//   //   }

//   //   // Create admin user
//   //   const hashedPassword = await bcrypt.hash('admin123', 10);
//   //   await userRepository.save({
//   //     email: 'admin@example.com',
//   //     password: hashedPassword,
//   //     firstName: 'Admin',
//   //     lastName: 'User',
//   //     role: UserRole.ADMIN
//   //   });

//   //   // Create regular user
//   //   const regularUserPassword = await bcrypt.hash('user123', 10);
//   //   await userRepository.save({
//   //     email: 'user@example.com',
//   //     password: regularUserPassword,
//   //     firstName: 'Regular',
//   //     lastName: 'User',
//   //     role: UserRole.USER,
//   //   });
//   // }

//   // private async seedGenres() {
//   //   const genreRepository = this.dataSource.getRepository(Genre);

//   //   const genres = [
//   //     'Action',
//   //     'Adventure',
//   //     'Animation',
//   //     'Comedy',
//   //     'Crime',
//   //     'Documentary',
//   //     'Drama',
//   //     'Fantasy',
//   //     'Horror',
//   //     'Romance',
//   //     'Science Fiction',
//   //     'Thriller',
//   //   ];

//   //   for (const genreName of genres) {
//   //     const exists = await genreRepository.findOne({
//   //       where: { name: genreName },
//   //     });
//   //     if (!exists) {
//   //       await genreRepository.save({ name: genreName });
//   //     }
//   //   }
//   // }

//   // // src/database/seeds/seed.service.ts (continued)
//   // private async seedMovies() {
//   //   const movieRepository = this.dataSource.getRepository(Movie);
//   //   const genreRepository = this.dataSource.getRepository(Genre);
//   //   const movieGenreRepository = this.dataSource.getRepository(MovieGenre);

//   //   const movies = [
//   //     {
//   //       title: 'Inception',
//   //       description:
//   //         'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
//   //       posterUrl: 'https://example.com/inception.jpg',
//   //       durationMinutes: 148,
//   //       genres: ['Science Fiction', 'Action', 'Thriller'],
//   //     },
//   //     {
//   //       title: 'The Shawshank Redemption',
//   //       description:
//   //         'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
//   //       posterUrl: 'https://example.com/shawshank.jpg',
//   //       durationMinutes: 142,
//   //       genres: ['Drama', 'Crime'],
//   //     },
//   //     {
//   //       title: 'The Dark Knight',
//   //       description:
//   //         'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
//   //       posterUrl: 'https://example.com/dark-knight.jpg',
//   //       durationMinutes: 152,
//   //       genres: ['Action', 'Crime', 'Drama'],
//   //     },
//   //     {
//   //       title: 'Pulp Fiction',
//   //       description:
//   //         'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
//   //       posterUrl: 'https://example.com/pulp-fiction.jpg',
//   //       durationMinutes: 154,
//   //       genres: ['Crime', 'Drama'],
//   //     },
//   //     {
//   //       title: 'The Matrix',
//   //       description:
//   //         'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
//   //       posterUrl: 'https://example.com/matrix.jpg',
//   //       durationMinutes: 136,
//   //       genres: ['Action', 'Science Fiction'],
//   //     },
//   //   ];

//   //   for (const movieData of movies) {
//   //     // Check if movie already exists
//   //     const exists = await movieRepository.findOne({
//   //       where: { title: movieData.title },
//   //     });
//   //     if (exists) {
//   //       continue;
//   //     }

//   //     // Create movie
//   //     const movie = await movieRepository.save({
//   //       title: movieData.title,
//   //       description: movieData.description,
//   //       posterUrl: movieData.posterUrl,
//   //       durationMinutes: movieData.durationMinutes,
//   //     });

//   //     // Associate genres
//   //     for (const genreName of movieData.genres) {
//   //       const genre = await genreRepository.findOne({
//   //         where: { name: genreName },
//   //       });
//   //       if (genre) {
//   //         await movieGenreRepository.save({
//   //           movieId: movie.id,
//   //           genreId: genre.id,
//   //         });
//   //       }
//   //     }
//   //   }
//   // }

//   // private async seedTheaters() {
//   //   const theaterRepository = this.dataSource.getRepository(Theater);

//   //   const theaters = [
//   //     { name: 'Theater 1', capacity: 120 },
//   //     { name: 'Theater 2', capacity: 80 },
//   //     { name: 'Theater 3', capacity: 150 },
//   //     { name: 'IMAX Theater', capacity: 200 },
//   //     { name: 'VIP Theater', capacity: 50 },
//   //   ];

//   //   for (const theaterData of theaters) {
//   //     const exists = await theaterRepository.findOne({
//   //       where: { name: theaterData.name },
//   //     });
//   //     if (!exists) {
//   //       await theaterRepository.save(theaterData);
//   //     }
//   //   }
//   // }

//   // private async seedSeatCategories() {
//   //   const seatCategoryRepository = this.dataSource.getRepository(SeatCategory);

//   //   const categories = [
//   //     { name: 'Standard', price: 10.0 },
//   //     { name: 'Premium', price: 15.0 },
//   //     { name: 'VIP', price: 25.0 },
//   //   ];

//   //   for (const categoryData of categories) {
//   //     const exists = await seatCategoryRepository.findOne({
//   //       where: { name: categoryData.name },
//   //     });
//   //     if (!exists) {
//   //       await seatCategoryRepository.save(categoryData);
//   //     }
//   //   }
//   // }

//   // private async seedSeats() {
//   //   const seatRepository = this.dataSource.getRepository(Seat);
//   //   const theaterRepository = this.dataSource.getRepository(Theater);
//   //   const seatCategoryRepository = this.dataSource.getRepository(SeatCategory);

//   //   const theaters = await theaterRepository.find();
//   //   const categories = await seatCategoryRepository.find();

//   //   // Map categories by name for easier access
//   //   const categoryMap = {};
//   //   categories.forEach((category) => {
//   //     categoryMap[category.name] = category;
//   //   });

//   //   for (const theater of theaters) {
//   //     // Check if seats already exist for this theater
//   //     const existingSeats = await seatRepository.count({
//   //       where: { theaterId: theater.id },
//   //     });
//   //     if (existingSeats > 0) {
//   //       continue;
//   //     }

//   //     // Create seats based on theater capacity
//   //     const rows = [
//   //       'A',
//   //       'B',
//   //       'C',
//   //       'D',
//   //       'E',
//   //       'F',
//   //       'G',
//   //       'H',
//   //       'I',
//   //       'J',
//   //       'K',
//   //       'L',
//   //       'M',
//   //       'N',
//   //       'O',
//   //     ];
//   //     const seatsPerRow = Math.ceil(theater.capacity / rows.length);

//   //     let seatCount = 0;
//   //     let rowIndex = 0;

//   //     while (seatCount < theater.capacity && rowIndex < rows.length) {
//   //       const row = rows[rowIndex];
//   //       for (
//   //         let seatNum = 1;
//   //         seatNum <= seatsPerRow && seatCount < theater.capacity;
//   //         seatNum++
//   //       ) {
//   //         // Determine seat category based on position
//   //         let categoryName = 'Standard';
//   //         if (
//   //           row >= 'C' &&
//   //           row <= 'G' &&
//   //           seatNum >= Math.floor(seatsPerRow * 0.3) &&
//   //           seatNum <= Math.floor(seatsPerRow * 0.7)
//   //         ) {
//   //           categoryName = 'Premium';
//   //         }
//   //         if (
//   //           row >= 'E' &&
//   //           row <= 'F' &&
//   //           seatNum >= Math.floor(seatsPerRow * 0.4) &&
//   //           seatNum <= Math.floor(seatsPerRow * 0.6)
//   //         ) {
//   //           categoryName = 'VIP';
//   //         }

//   //         await seatRepository.save({
//   //           theaterId: theater.id,
//   //           row,
//   //           number: seatNum,
//   //           categoryId: categoryMap[categoryName].id,
//   //         });

//   //         seatCount++;
//   //       }
//   //       rowIndex++;
//   //     }
//   //   }
//   // }

//   // async seedShowtimes() {
//   //   const showtimeRepository = this.dataSource.getRepository(Showtime);
//   //   const movieRepository = this.dataSource.getRepository(Movie);
//   //   const theaterRepository = this.dataSource.getRepository(Theater);

//   //   // Get movies and theaters
//   //   const movies = await movieRepository.find();
//   //   const theaters = await theaterRepository.find();

//   //   // Check if showtimes already exist
//   //   const existingShowtimes = await showtimeRepository.count();
//   //   if (existingShowtimes > 0) {
//   //     return;
//   //   }

//   //   // Generate showtimes for the next 7 days
//   //   const startDate = new Date();
//   //   startDate.setHours(0, 0, 0, 0);

//   //   for (let day = 0; day < 7; day++) {
//   //     const currentDate = new Date(startDate);
//   //     currentDate.setDate(currentDate.getDate() + day);

//   //     // Create 3-4 showtimes per theater per day
//   //     for (const theater of theaters) {
//   //       // Randomly select 2-3 movies to show in this theater today
//   //       const shuffledMovies = [...movies].sort(() => 0.5 - Math.random());
//   //       const moviesToShow = shuffledMovies.slice(
//   //         0,
//   //         Math.floor(Math.random() * 2) + 2,
//   //       );

//   //       // Define showtime slots
//   //       const slots = [
//   //         { hour: 10, minute: 0 },
//   //         { hour: 13, minute: 30 },
//   //         { hour: 17, minute: 0 },
//   //         { hour: 20, minute: 30 },
//   //       ];

//   //       let slotIndex = 0;
//   //       for (const movie of moviesToShow) {
//   //         if (slotIndex >= slots.length) break;

//   //         const slot = slots[slotIndex];
//   //         const startsAt = new Date(currentDate);
//   //         startsAt.setHours(slot.hour, slot.minute, 0, 0);

//   //         const endsAt = new Date(startsAt);
//   //         endsAt.setMinutes(endsAt.getMinutes() + movie.durationMinutes);

//   //         await showtimeRepository.save({
//   //           movieId: movie.id,
//   //           theaterId: theater.id,
//   //           startsAt,
//   //           endsAt,
//   //         });

//   //         slotIndex++;
//   //       }
//   //     }
//   //   }
//   // }
// }

@Injectable()
export class SeedService {
  constructor(private dataSource: DataSource) {}

  async seed() {
    const logger = new Logger('Seed');

    try {
      logger.log('Seeding database...');

      // Create admin user
      const userRepository = this.dataSource.getRepository(User);
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
      const genreRepository = this.dataSource.getRepository(Genre);
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
      const movieRepository = this.dataSource.getRepository(Movie);
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
    }
  }
}
