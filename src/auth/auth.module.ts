import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    // Importamos la entidad Usuario para validar credenciales
    TypeOrmModule.forFeature([Usuario]),

    // PassportModule habilita el uso de estrategias de autenticación
    PassportModule,

    // JwtModule configura la generación y validación de tokens JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.getOrThrow<string>('JWT_SECRET');
        const expiresIn = configService.get<number>('JWT_EXPIRES_IN', 86400); // 24h por defecto

        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy, // Estrategia para login con email/password
    JwtStrategy, // Estrategia para validar tokens JWT
  ],
  exports: [AuthService], // Exportamos para usar en otros módulos si es necesario
})
export class AuthModule {}
