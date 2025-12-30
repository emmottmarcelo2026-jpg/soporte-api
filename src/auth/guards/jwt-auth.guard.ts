import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard - Guard para proteger rutas con autenticación JWT
 *
 * Uso:
 * @UseGuards(JwtAuthGuard)
 * @Get('perfil')
 * getPerfil(@Request() req) {
 *   return req.user; // Usuario autenticado
 * }
 *
 * Este guard activa la JwtStrategy automáticamente.
 * Si el token es válido, la request pasa.
 * Si no hay token o es inválido, retorna 401 Unauthorized.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
