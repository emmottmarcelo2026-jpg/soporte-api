import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';

export class UpdateUsuarioDto {
  @ApiPropertyOptional({
    example: 'Marcelo',
    description: 'Nuevo nombre del usuario',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Emmott',
    description: 'Nuevo apellido del usuario',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Nuevo rol asignado',
  })
  @IsOptional()
  @IsInt()
  roleId?: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'Nueva área organizacional',
  })
  @IsOptional()
  @IsInt()
  areaId?: number;

  @ApiPropertyOptional({
    example: UserStatus.INACTIVE,
    enum: UserStatus,
    description: 'Estado del usuario',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
