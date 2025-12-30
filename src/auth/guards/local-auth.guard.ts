import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * LocalAuthGuard - Guard para el endpoint de login
 *
 * Uso:
 * @UseGuards(LocalAuthGuard)
 * @Post('login')
 * login(@Request() req) {
 *   return this.authService.login(req.user);
 * }
 *
 * Este guard activa la LocalStrategy automáticamente.
 * Passport extrae email y password del body y los valida.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
