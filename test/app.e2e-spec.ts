// test/app.e2e-spec.ts (continued)
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../src/users/users.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            url: configService.get('DATABASE_URL'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
            dropSchema: true, // Clean database for tests
          }),
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same pipes and filters as in the main app
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    // Get auth service for generating test tokens
    authService = app.get<AuthService>(AuthService);

    // Create a test admin user
    const usersService = app.get<UsersService>(UsersService);
    await usersService.createTestUser({
      email: 'testadmin@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'Admin',
      role: 'admin',
    });

    // Get JWT token for the test user
    const loginResult = await authService.login({
      email: 'testadmin@example.com',
      password: 'password123',
    });

    jwtToken = loginResult.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('/auth/register (POST) - should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body.user).toHaveProperty('email', 'newuser@example.com');
          expect(res.body.user).toHaveProperty('role', 'user');
        });
    });

    it('/auth/login (POST) - should login a user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });
  });

  describe('Movies', () => {
    let movieId: string;

    it('/movies (POST) - should create a new movie', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          title: 'Test Movie',
          description: 'A test movie description',
          durationMinutes: 120,
          genreIds: [],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('title', 'Test Movie');
          movieId = res.body.id;
        });
    });

    it('/movies (GET) - should return all movies', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/movies/:id (GET) - should return a movie by id', () => {
      return request(app.getHttpServer())
        .get(`/movies/${movieId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', movieId);
          expect(res.body).toHaveProperty('title', 'Test Movie');
        });
    });

    it('/movies/:id (PATCH) - should update a movie', () => {
      return request(app.getHttpServer())
        .patch(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          title: 'Updated Test Movie',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('title', 'Updated Test Movie');
        });
    });
  });

  // Additional test suites for other endpoints...
});
