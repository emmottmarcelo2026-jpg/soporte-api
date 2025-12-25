import { Module } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { EmpresasController } from './empresas.controller';
import { ContactosModule } from './contactos/contactos.module';
import { SuscripcionesModule } from './suscripciones/suscripciones.module';

@Module({
  controllers: [EmpresasController],
  providers: [EmpresasService],
  imports: [ContactosModule, SuscripcionesModule],
})
export class EmpresasModule {}
