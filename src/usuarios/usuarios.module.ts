import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { RolesModule } from './roles/roles.module';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [RolesModule],
})
export class UsuariosModule {}
