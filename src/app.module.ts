import { SeedsModule } from './database/seeds/seeds.module';
import { ConfigModule } from './config/config.module';
import { GenresModule } from './genres/genres.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { SeatsModule } from './seats/seats.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ReportsModule } from './reports/reports.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SeedsModule,
    ConfigModule,
    GenresModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'postgres'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'movie_reservation'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize:
          configService.get('NODE_ENV', 'development') !== 'production',
      }),
      inject: [ConfigService],
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    EventEmitterModule.forRoot(),

    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 5, // 5 minutes
    }),

    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    MoviesModule,
    ShowtimesModule,
    SeatsModule,
    ReservationsModule,
    ReportsModule,
    // SeedModule,
  ],
  exports: [AuthModule, UsersModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
