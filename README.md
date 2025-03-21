<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Movie Reservation System

A comprehensive backend system for a movie reservation service built with NestJS, PostgreSQL, and Docker.

## Features

- **User Authentication and Authorization**

  - JWT-based authentication
  - Role-based access control (Admin and User roles)
  - Secure password hashing

- **Movie Management**

  - CRUD operations for movies
  - Movie categorization by genre
  - Movie poster image upload

- **Theater and Showtime Management**

  - Theater configuration with seat layouts
  - Scheduling of movie showtimes
  - Seat category pricing

- **Reservation System**

  - Real-time seat availability checking
  - Seat reservation with conflict prevention
  - Reservation management (view, cancel)

- **Reporting**

  - Revenue reports by movie, time period
  - Theater occupancy reports
  - Popular movies ranking

- **Additional Features**
  - Rate limiting
  - Health checks
  - Comprehensive logging
  - Caching for performance
  - API versioning
  - File uploads
  - Event-based notifications
  - Scheduled tasks
  - Exception handling
  - Configuration validation
  - API documentation with Swagger
  - Comprehensive testing

## Technology Stack

- **Backend Framework**: NestJS
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Authentication**: JWT, Passport
- **Validation**: class-validator, Joi
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Testing**: Jest, SuperTest

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DAMMAK/movie-mate.git
   cd movie-mate

   ```

2. Create a `.env` file in the root directory with the following content:

```
PORT=3000
NODE_ENV=development
JWT_SECRET=  //Include JWT_SECRET Of your choice or use this https://jwtsecret.com/generate to generate JWT_SECRET
JWT_EXPIRATION=1d
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=movie_reservation
API_URL=http://localhost:3000
```

3. Start the application using Docker Compose:

` docker-compose up -d`

4. The API will be available at: http://localhost:3000
   The API documentation will be available at: http://localhost:
