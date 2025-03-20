// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService) => ({
//         type: 'postgres',
//         host: configService.dbHost,
//         port: configService.dbPort,
//         username: configService.dbUsername,
//         password: configService.dbPassword,
//         database: configService.dbDatabase,
//         entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//         synchronize: configService.isDevelopment,
//       }),
//     }),
//   ],
// })
// export class DatabaseModule {}
