// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config(); // <-- load env variables here

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://brana-artworks.vercel.app',
      /\.vercel\.app$/,
      /\.netlify\.app$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  
  // Increase payload size limit for image uploads
  app.use(require('express').json({ limit: '50mb' }));
  app.use(require('express').urlencoded({ limit: '50mb', extended: true }));
  const port = process.env.PORT || 10000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend Server listening on port ${port}`);
}
bootstrap().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

