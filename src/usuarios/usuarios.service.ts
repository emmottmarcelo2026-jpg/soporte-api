import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Role } from './roles/entities/role.entity';
import { Area } from 'src/areas/entities/area.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
    @InjectRepository(Area)
    private readonly areasRepo: Repository<Area>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const role = await this.rolesRepo.findOne({
      where: { id: createUsuarioDto.roleId },
    });
    if (!role) {
      throw new BadRequestException('roleId inválido');
    }

    const area = await this.areasRepo.findOne({
      where: { id: createUsuarioDto.areaId },
    });
    if (!area) {
      throw new BadRequestException('areaId inválido');
    }

    const usuario = this.usuariosRepo.create({
      firstName: createUsuarioDto.firstName,
      lastName: createUsuarioDto.lastName,
      email: createUsuarioDto.email,
      rut: createUsuarioDto.rut,
      role,
      area,
    });

    try {
      return await this.usuariosRepo.save(usuario);
    } catch (err: any) {
      if (err?.code === '23505') {
        throw new ConflictException('Email o RUT ya existe');
      }
      throw err;
    }
  }

  async findAll() {
    return this.usuariosRepo.find();
  }

  async findOne(id: number) {
    const usuario = await this.usuariosRepo.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuariosRepo.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (updateUsuarioDto.roleId !== undefined) {
      const role = await this.rolesRepo.findOne({
        where: { id: updateUsuarioDto.roleId },
      });
      if (!role) {
        throw new BadRequestException('roleId inválido');
      }
      usuario.role = role;
    }

    if (updateUsuarioDto.areaId !== undefined) {
      const area = await this.areasRepo.findOne({
        where: { id: updateUsuarioDto.areaId },
      });
      if (!area) {
        throw new BadRequestException('areaId inválido');
      }
      usuario.area = area;
    }

    if (updateUsuarioDto.firstName !== undefined) {
      usuario.firstName = updateUsuarioDto.firstName;
    }
    if (updateUsuarioDto.lastName !== undefined) {
      usuario.lastName = updateUsuarioDto.lastName;
    }
    if (updateUsuarioDto.status !== undefined) {
      usuario.status = updateUsuarioDto.status;
    }

    try {
      return await this.usuariosRepo.save(usuario);
    } catch (err: any) {
      if (err?.code === '23505') {
        throw new ConflictException('Email o RUT ya existe');
      }
      throw err;
    }
  }

  async remove(id: number) {
    const result = await this.usuariosRepo.delete({ id });
    if (!result.affected) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return { deleted: true };
  }
}
