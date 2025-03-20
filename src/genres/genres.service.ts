// src/genres/genres.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genresRepository: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const existingGenre = await this.genresRepository.findOne({
      where: { name: createGenreDto.name },
    });

    if (existingGenre) {
      throw new ConflictException('Genre already exists');
    }

    const genre = this.genresRepository.create(createGenreDto);
    return this.genresRepository.save(genre);
  }

  async findAll(): Promise<Genre[]> {
    return this.genresRepository.find();
  }

  async findOne(id: string): Promise<Genre> {
    const genre = await this.genresRepository.findOne({ where: { id } });
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    return genre;
  }

  async update(id: string, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.findOne(id);

    if (updateGenreDto.name && updateGenreDto.name !== genre.name) {
      const existingGenre = await this.genresRepository.findOne({
        where: { name: updateGenreDto.name },
      });

      if (existingGenre) {
        throw new ConflictException('Genre name already exists');
      }
    }

    this.genresRepository.merge(genre, updateGenreDto);
    return this.genresRepository.save(genre);
  }

  async remove(id: string): Promise<void> {
    const result = await this.genresRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
  }
}
