import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ==================== CORS ====================
  // Necesario para que Next.js pueda comunicarse con esta API
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      configService.get<string>('FRONTEND_URL') || 'http://localhost:3001',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // ==================== Validación Global ====================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ==================== Serialización ====================
  // Activa @Exclude() y @Expose() de class-transformer
  // Esto asegura que campos como passwordHash NUNCA se serialicen
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // ==================== Swagger ====================
  const config = new DocumentBuilder()
    .setTitle('Soporte API')
    .setDescription('API para gestión de tickets de soporte - Emmott Systems')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ==================== Puerto ====================
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`🚀 API corriendo en: http://localhost:${port}`);
  console.log(`📚 Swagger en: http://localhost:${port}/api/docs`);
}
bootstrap();
