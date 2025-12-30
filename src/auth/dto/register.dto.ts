import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para el registro de nuevos usuarios
 * Solo ADMIN puede registrar usuarios
 */
export class RegisterDto {
  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  firstName: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  lastName: string;

  @ApiProperty({
    example: 'juan.perez@emmott.cl',
    description: 'Email del usuario (debe ser único)',
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    example: 'MiPassword123',
    description: 'Contraseña temporal que el admin asigna al usuario',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiPropertyOptional({
    example: '12345678-9',
    description: 'RUT del usuario (opcional)',
  })
  @IsString()
  @IsOptional()
  rut?: string;

  @ApiProperty({
    example: 5,
    description:
      'ID del rol: 1=ADMIN, 2=SUPERVISOR, 3=ANALYST, 4=QA, 5=DEVELOPER',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'El roleId es requerido' })
  roleId: number;

  @ApiProperty({
    example: 2,
    description:
      'ID del área: 1=Soporte, 2=Desarrollo, 3=Marketing, 4=Finanzas, 5=RRHH',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'El areaId es requerido' })
  areaId: number;
}
