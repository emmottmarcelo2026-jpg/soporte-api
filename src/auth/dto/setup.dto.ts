import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para crear el primer administrador del sistema
 * Solo funciona cuando no hay usuarios en la base de datos
 */
export class SetupDto {
  @ApiProperty({
    example: 'Admin',
    description: 'Nombre del administrador',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  firstName: string;

  @ApiProperty({
    example: 'Sistema',
    description: 'Apellido del administrador',
  })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  lastName: string;

  @ApiProperty({
    example: 'admin@emmott.cl',
    description: 'Email del administrador',
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    example: 'AdminPassword123',
    description: 'Contraseña del administrador (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
