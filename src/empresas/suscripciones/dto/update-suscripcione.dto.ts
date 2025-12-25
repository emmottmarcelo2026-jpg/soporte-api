import { PartialType } from '@nestjs/swagger';
import { CreateSuscripcioneDto } from './create-suscripcione.dto';

export class UpdateSuscripcioneDto extends PartialType(CreateSuscripcioneDto) {}
