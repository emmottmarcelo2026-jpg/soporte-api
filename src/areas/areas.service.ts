import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private readonly areasRepo: Repository<Area>,
  ) {}

  async create(createAreaDto: CreateAreaDto) {
    const existing = await this.areasRepo.findOne({
      where: { name: createAreaDto.name },
    });
    if (existing) {
      throw new ConflictException(`El área "${createAreaDto.name}" ya existe`);
    }

    const area = this.areasRepo.create(createAreaDto);
    return this.areasRepo.save(area);
  }

  async findAll() {
    return this.areasRepo.find();
  }

  async findOne(id: number) {
    const area = await this.areasRepo.findOne({ where: { id } });
    if (!area) {
      throw new NotFoundException('Área no encontrada');
    }
    return area;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    const area = await this.areasRepo.findOne({ where: { id } });
    if (!area) {
      throw new NotFoundException('Área no encontrada');
    }

    if (updateAreaDto.name && updateAreaDto.name !== area.name) {
      const existing = await this.areasRepo.findOne({
        where: { name: updateAreaDto.name },
      });
      if (existing) {
        throw new ConflictException(
          `El área "${updateAreaDto.name}" ya existe`,
        );
      }
    }

    Object.assign(area, updateAreaDto);
    return this.areasRepo.save(area);
  }

  async remove(id: number) {
    const result = await this.areasRepo.delete({ id });
    if (!result.affected) {
      throw new NotFoundException('Área no encontrada');
    }
    return { deleted: true };
  }
}
