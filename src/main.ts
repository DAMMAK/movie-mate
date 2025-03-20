// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { SeedService } from './database/seeds/seeds.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/winston.config';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  // Apply global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Setup static file serving
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Setup Swagger
  // Enhanced Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Movie Reservation API')
    .setDescription(
      `
      API for a movie reservation system. Allows users to browse movies, 
      reserve seats for specific showtimes, and manage their reservations.
      
      ## Features
      - User authentication and role-based access control
      - Movie and showtime management
      - Seat reservation with conflict prevention
      - Reporting on reservations, revenue, and occupancy
      
      ## Roles
      - **Admin**: Can manage movies, showtimes, theaters, and view all reports
      - **User**: Can browse movies, reserve seats, and manage their own reservations
    `,
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('movies', 'Movie management endpoints')
    .addTag('showtimes', 'Showtime management endpoints')
    .addTag('theaters', 'Theater management endpoints')
    .addTag('seats', 'Seat management endpoints')
    .addTag('reservations', 'Reservation endpoints')
    .addTag('reports', 'Reporting endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Seed the database
  const seedService = app.get(SeedService);
  await seedService.seed();

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
