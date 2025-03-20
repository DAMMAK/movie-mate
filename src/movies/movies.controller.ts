import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll(@Query('genre') genre?: string) {
    return this.moviesService.findAll(genre);
  }

  @Get('genre/:genreId')
  findByGenre(@Param('genreId') genreId: string) {
    return this.moviesService.findByGenre(genreId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }

  //   @Post('upload-poster/:id')
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles(Role.ADMIN)
  //   @UseInterceptors(
  //     FileInterceptor('poster', {
  //       storage: diskStorage({
  //         destination: './uploads/posters',
  //         filename: (req, file, callback) => {
  //           const uniqueSuffix =
  //             Date.now() + '-' + Math.round(Math.random() * 1e9);
  //           const ext = extname(file.originalname);
  //           const filename = `${uniqueSuffix}${ext}`;
  //           callback(null, filename);
  //         },
  //       }),
  //       fileFilter: (req, file, callback) => {
  //         if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
  //           return callback(
  //             new BadRequestException('Only image files are allowed!'),
  //             false,
  //           );
  //         }
  //         callback(null, true);
  //       },
  //       limits: {
  //         fileSize: 1024 * 1024 * 5, // 5MB
  //       },
  //     }),
  //   )
  //   async uploadPoster(
  //     @Param('id') id: string,
  //     @UploadedFile() file: Express.Multer.File,
  //   ) {
  //     const posterUrl = `${process.env.API_URL}/uploads/posters/${file.filename}`;
  //     return this.moviesService.updatePoster(id, posterUrl);
  //   }
}
