import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    example: 'Marcelo',
    description: 'Nombre del usuario',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Emmott',
    description: 'Apellido del usuario',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'marcelo.emmott@emmott.cl',
    description: 'Correo electrónico corporativo',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 1,
    description: 'ID del rol asignado al usuario',
  })
  @IsInt()
  roleId: number;

  @ApiProperty({
    example: 2,
    description: 'ID del área organizacional',
  })
  @IsInt()
  areaId: number;

  @ApiProperty({
    example: '12.345.678-9',
    description: 'RUT del usuario (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  rut?: string;
}
