import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({ origin: true, credentials: true, allowedHeaders: ["Content-Type", "Authorization", "x-user-id"], methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"] });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3002;
  await app.listen(port);
  logger.log(`🚀 Product Service running on port ${port}`);
}
bootstrap();
