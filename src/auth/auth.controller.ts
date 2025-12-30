import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SetupDto } from './dto/setup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('🔐 Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/setup
   * Endpoint para inicialización del sistema (solo funciona una vez)
   */
  @ApiOperation({
    summary: '🚀 Setup inicial - Crear primer administrador',
    description: `
**⚠️ IMPORTANTE: Este endpoint solo funciona UNA VEZ**

Crea el primer usuario administrador del sistema. Después de ejecutarlo,
este endpoint quedará deshabilitado permanentemente.

**Requisitos previos:**
1. Tener roles creados (al menos el rol con ID 1 = ADMIN)
2. Tener áreas creadas (al menos el área con ID 1 = Soporte)

**Flujo recomendado:**
1. Crear roles con POST /roles
2. Crear áreas con POST /areas
3. Ejecutar este endpoint para crear el admin
4. Usar el token retornado para crear más usuarios
    `,
  })
  @ApiBody({ type: SetupDto })
  @ApiResponse({
    status: 201,
    description: 'Sistema inicializado correctamente',
    schema: {
      example: {
        message: '🎉 Sistema inicializado correctamente. ¡Bienvenido!',
        admin: {
          id: 1,
          publicId: 'uuid-generado',
          email: 'admin@emmott.cl',
          firstName: 'Admin',
          lastName: 'Sistema',
          role: { id: 1, name: 'ADMIN' },
          area: { id: 1, name: 'Soporte' },
        },
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        next_steps: [
          '1. Guarda el access_token para autenticarte',
          '2. Usa POST /auth/register para crear más usuarios',
          '3. Explora la API en /api/docs',
        ],
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'El sistema ya fue inicializado',
    schema: {
      example: {
        statusCode: 403,
        message:
          'El sistema ya fue inicializado. Este endpoint solo funciona cuando no hay usuarios.',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Faltan roles o áreas',
    schema: {
      example: {
        statusCode: 400,
        message: 'Debes crear los roles y áreas antes de ejecutar el setup.',
        error: 'Bad Request',
      },
    },
  })
  @Post('setup')
  async setup(@Body() setupDto: SetupDto) {
    return this.authService.setup(setupDto);
  }

  /**
   * POST /auth/login
   * Endpoint público para iniciar sesión
   */
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: `
Autentica un usuario con email y contraseña.

**Flujo:**
1. Envía email y password
2. Si son correctos, recibes un \`access_token\` (JWT)
3. Usa ese token en el header \`Authorization: Bearer <token>\` para acceder a rutas protegidas

**El token expira en 24 horas**
    `,
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          publicId: 'uuid-generado',
          email: 'admin@emmott.cl',
          firstName: 'Admin',
          lastName: 'Sistema',
          role: { id: 1, name: 'ADMIN' },
          area: { id: 1, name: 'Soporte' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciales inválidas',
        error: 'Unauthorized',
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  /**
   * POST /auth/register
   * Endpoint PROTEGIDO - Solo usuarios autenticados pueden registrar nuevos usuarios
   */
  @ApiOperation({
    summary: 'Registrar nuevo usuario (Requiere autenticación)',
    description: `
**🔒 Requiere autenticación**

Crea un nuevo usuario en el sistema.

**Requisitos:**
- Debes estar autenticado con un token JWT válido
- El roleId y areaId deben existir en el sistema

**Nota:** Este endpoint NO retorna token. El usuario creado deberá hacer login.
    `,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      example: {
        message: 'Usuario registrado exitosamente',
        user: {
          id: 2,
          publicId: 'uuid-generado',
          email: 'nuevo.usuario@emmott.cl',
          firstName: 'Nuevo',
          lastName: 'Usuario',
          status: 'ACTIVE',
          role: { id: 5, name: 'DEVELOPER' },
          area: { id: 2, name: 'Desarrollo de Software' },
          createdAt: '2025-12-30T18:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email o RUT ya existe',
  })
  @ApiResponse({
    status: 400,
    description: 'roleId o areaId inválido',
  })
  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * GET /auth/profile
   * Obtiene el perfil del usuario autenticado
   */
  @ApiOperation({
    summary: 'Obtener mi perfil',
    description: `
**🔒 Requiere autenticación**

Retorna la información completa del usuario autenticado.
    `,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
    schema: {
      example: {
        id: 1,
        publicId: 'uuid-generado',
        firstName: 'Admin',
        lastName: 'Sistema',
        email: 'admin@emmott.cl',
        rut: '11111111-1',
        status: 'ACTIVE',
        createdAt: '2025-12-30T18:00:00.000Z',
        updatedAt: '2025-12-30T18:00:00.000Z',
        role: { id: 1, name: 'ADMIN' },
        area: { id: 1, name: 'Soporte' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido o expirado',
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }
}
