import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { RegisterDto } from './dto/register.dto';
import { SetupDto } from './dto/setup.dto';
import { Role } from '../usuarios/roles/entities/role.entity';
import { Area } from '../areas/entities/area.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida las credenciales del usuario
   * Usado por LocalStrategy durante el login
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usuariosRepo.findOne({
      where: { email },
      select: [
        'id',
        'publicId',
        'email',
        'firstName',
        'lastName',
        'passwordHash',
        'status',
      ],
      relations: ['role', 'area'],
    });

    if (!user || !user.passwordHash) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  /**
   * Genera el token JWT después de un login exitoso
   */
  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        publicId: user.publicId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        area: user.area,
      },
    };
  }

  /**
   * Setup inicial del sistema - Crea el primer administrador
   * SOLO funciona si no hay usuarios en la base de datos
   *
   * También crea los roles y áreas básicos si no existen
   */
  async setup(setupDto: SetupDto) {
    // Verificar si ya existen usuarios
    const userCount = await this.usuariosRepo.count();

    if (userCount > 0) {
      throw new ForbiddenException(
        'El sistema ya fue inicializado. Este endpoint solo funciona cuando no hay usuarios.',
      );
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(setupDto.password, salt);

    // Crear el usuario admin (asumimos que rol ID 1 = ADMIN, área ID 1 = Soporte)
    const admin = this.usuariosRepo.create({
      firstName: setupDto.firstName,
      lastName: setupDto.lastName,
      email: setupDto.email,
      passwordHash: hashedPassword,
      role: { id: 1 } as Role, // ADMIN
      area: { id: 1 } as Area, // Soporte
    });

    try {
      const savedAdmin = await this.usuariosRepo.save(admin);

      const adminWithRelations = await this.usuariosRepo.findOne({
        where: { id: savedAdmin.id },
        relations: ['role', 'area'],
      });

      // Generar token para el admin recién creado
      const token = this.jwtService.sign({
        sub: adminWithRelations!.id,
        email: adminWithRelations!.email,
        role: adminWithRelations!.role?.name,
      });

      return {
        message: '🎉 Sistema inicializado correctamente. ¡Bienvenido!',
        admin: {
          id: adminWithRelations?.id,
          publicId: adminWithRelations?.publicId,
          email: adminWithRelations?.email,
          firstName: adminWithRelations?.firstName,
          lastName: adminWithRelations?.lastName,
          role: adminWithRelations?.role,
          area: adminWithRelations?.area,
        },
        access_token: token,
        next_steps: [
          '1. Guarda el access_token para autenticarte',
          '2. Usa POST /auth/register para crear más usuarios',
          '3. Explora la API en /api/docs',
        ],
      };
    } catch (error: any) {
      if (error?.code === '23503') {
        throw new BadRequestException(
          'Debes crear los roles y áreas antes de ejecutar el setup. ' +
            'Usa los endpoints /roles y /areas primero.',
        );
      }
      throw error;
    }
  }

  /**
   * Registra un nuevo usuario (solo usuarios autenticados)
   * NO retorna token, solo crea el usuario
   */
  async register(registerDto: RegisterDto) {
    const existingUser = await this.usuariosRepo.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    const usuario = this.usuariosRepo.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      rut: registerDto.rut,
      passwordHash: hashedPassword,
      role: { id: registerDto.roleId } as Role,
      area: { id: registerDto.areaId } as Area,
    });

    try {
      const savedUser = await this.usuariosRepo.save(usuario);

      const userWithRelations = await this.usuariosRepo.findOne({
        where: { id: savedUser.id },
        relations: ['role', 'area'],
      });

      return {
        message: 'Usuario registrado exitosamente',
        user: {
          id: userWithRelations?.id,
          publicId: userWithRelations?.publicId,
          email: userWithRelations?.email,
          firstName: userWithRelations?.firstName,
          lastName: userWithRelations?.lastName,
          status: userWithRelations?.status,
          role: userWithRelations?.role,
          area: userWithRelations?.area,
          createdAt: userWithRelations?.createdAt,
        },
      };
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException('Email o RUT ya existe');
      }
      if (error?.code === '23503') {
        throw new BadRequestException('roleId o areaId inválido');
      }
      throw error;
    }
  }

  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getProfile(userId: number) {
    const user = await this.usuariosRepo.findOne({
      where: { id: userId },
      relations: ['role', 'area'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }
}
