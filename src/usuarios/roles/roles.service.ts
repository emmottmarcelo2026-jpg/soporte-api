import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const existing = await this.rolesRepo.findOne({
      where: { name: createRoleDto.name },
    });
    if (existing) {
      throw new ConflictException(`El rol "${createRoleDto.name}" ya existe`);
    }

    const role = this.rolesRepo.create(createRoleDto);
    return this.rolesRepo.save(role);
  }

  async findAll() {
    return this.rolesRepo.find();
  }

  async findOne(id: number) {
    const role = await this.rolesRepo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.rolesRepo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existing = await this.rolesRepo.findOne({
        where: { name: updateRoleDto.name },
      });
      if (existing) {
        throw new ConflictException(`El rol "${updateRoleDto.name}" ya existe`);
      }
    }

    Object.assign(role, updateRoleDto);
    return this.rolesRepo.save(role);
  }

  async remove(id: number) {
    const result = await this.rolesRepo.delete({ id });
    if (!result.affected) {
      throw new NotFoundException('Rol no encontrado');
    }
    return { deleted: true };
  }
}
