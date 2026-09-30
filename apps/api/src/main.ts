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

  // CORS - Explicitly support bldrmanagement.com, all subdomains, Vercel deployments, and local development
  const allowedOrigins = [
    process.env.STOREFRONT_URL || 'http://localhost:3000',
    process.env.PROVIDER_PORTAL_URL || 'http://localhost:3001',
    process.env.ADMIN_PORTAL_URL || 'http://localhost:3002',
    process.env.HUB_URL || 'http://localhost:3003',
    'https://bldrmanagement.com',
    'https://pay.bldrmanagement.com',
    'https://portal.bldrmanagement.com',
    'https://admin.bldrmanagement.com',
    'https://api.bldrmanagement.com',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile clients, curl, server-to-server, webhook callbacks from PSPs)
      if (!origin) {
        return callback(null, true);
      }

      // Check explicit allowed origins list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow any subdomain of bldrmanagement.com (e.g., https://*.bldrmanagement.com)
      const bldrSubdomainRegex = /^https?:\/\/([a-zA-Z0-9-]+\.)*bldrmanagement\.com$/;
      if (bldrSubdomainRegex.test(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview environments
      const vercelPreviewRegex = /^https:\/\/([a-zA-Z0-9-]+)\.vercel\.app$/;
      if (vercelPreviewRegex.test(origin)) {
        return callback(null, true);
      }

      // Allow local development ports
      const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
      if (localhostRegex.test(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS origin not allowed: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Idempotency-Key',
      'X-Signature',
      'X-Venture-Id',
    ],
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
  console.log(`[bldr] API running on http://localhost:${port}`);
  console.log(`[bldr] Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
