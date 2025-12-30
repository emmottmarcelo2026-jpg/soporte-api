import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * JwtStrategy - Estrategia de autenticación con Token JWT
 *
 * Esta estrategia se usa para PROTEGER RUTAS.
 * Passport la activa cuando usamos @UseGuards(JwtAuthGuard)
 *
 * Flujo:
 * 1. Usuario envía request con header: Authorization: Bearer <token>
 * 2. Passport extrae el token del header
 * 3. Verifica que el token sea válido (firma correcta, no expirado)
 * 4. Llama a validate() con el payload decodificado del token
 * 5. Lo que retorne validate() estará disponible en request.user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // Extrae el token del header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Si es false, Passport automáticamente rechaza tokens expirados
      ignoreExpiration: false,

      // La misma clave secreta usada para firmar los tokens (desde .env)
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * Este método es llamado DESPUÉS de que Passport verifica el token
   * El payload ya fue decodificado y verificado
   *
   * @param payload - El contenido del token JWT decodificado
   *                  Ejemplo: { sub: 1, email: 'juan@mail.com', iat: ..., exp: ... }
   * @returns Objeto que estará disponible en request.user
   */
  async validate(payload: any) {
    // Retornamos la información del usuario que queremos en request.user
    // 'sub' es el estándar JWT para el ID del sujeto (el usuario)
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
