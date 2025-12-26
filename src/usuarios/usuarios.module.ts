import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Area } from 'src/areas/entities/area.entity';
import { Role } from './roles/entities/role.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Role, Area]),
    RolesModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
