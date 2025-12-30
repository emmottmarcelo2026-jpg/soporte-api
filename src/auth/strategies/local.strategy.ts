import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * LocalStrategy - Estrategia de autenticación con email y contraseña
 *
 * Esta estrategia se usa en el endpoint de LOGIN.
 * Passport automáticamente la activa cuando usamos @UseGuards(AuthGuard('local'))
 *
 * Flujo:
 * 1. Usuario envía POST /auth/login con { email, password }
 * 2. Passport extrae email y password del body
 * 3. Llama a validate() con esos datos
 * 4. Si validate() retorna un usuario, el login es exitoso
 * 5. Si lanza excepción, el login falla
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // Por defecto Passport espera 'username' y 'password'
      // Cambiamos 'username' por 'email' porque usamos email para login
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  /**
   * Este método es llamado automáticamente por Passport
   * @param email - El email del usuario
   * @param password - La contraseña en texto plano
   * @returns El usuario si las credenciales son válidas
   * @throws UnauthorizedException si las credenciales son inválidas
   */
  async validate(email: string, password: string): Promise<any> {
    // Delegamos la validación al AuthService
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Lo que retornemos aquí estará disponible en request.user
    return user;
  }
}
