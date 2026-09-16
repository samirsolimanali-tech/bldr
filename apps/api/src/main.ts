import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production';
  const simulationMode = process.env.PAYMENT_SIMULATION_MODE ?? (isProd ? 'false' : 'true');

  if (isProd && simulationMode === 'true') {
    throw new Error(
      'FATAL SECURITY VIOLATION: PAYMENT_SIMULATION_MODE cannot be enabled when NODE_ENV=production. Aborting startup.',
    );
  }

  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Required for webhook signature verification
  });

  // CORS
  app.enableCors({
    origin: [
      process.env.STOREFRONT_URL || 'http://localhost:3000',
      process.env.PROVIDER_PORTAL_URL || 'http://localhost:3001',
      process.env.ADMIN_PORTAL_URL || 'http://localhost:3002',
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger API docs
  const config = new DocumentBuilder()
    .setTitle('bldr API')
    .setDescription('Multi-vendor service marketplace API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 4000;
  await app.listen(port);
  console.log(`🚀 bldr API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
