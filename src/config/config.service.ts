import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return parseInt(this.configService.get<string>('PORT', '3000'), 10);
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', 'secret');
  }

  get jwtExpiration(): string {
    return this.configService.get<string>('JWT_EXPIRATION', '1d');
  }

  get dbHost(): string {
    return this.configService.get<string>('DB_HOST', 'localhost');
  }

  get dbPort(): number {
    return parseInt(this.configService.get<string>('DB_PORT', '5432'), 10);
  }

  get dbUsername(): string {
    return this.configService.get<string>('DB_USERNAME', 'postgres');
  }

  get dbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD', 'postgres');
  }

  get dbDatabase(): string {
    return this.configService.get<string>('DB_DATABASE', 'movie_reservation');
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }
}
