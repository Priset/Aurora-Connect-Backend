import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';

export async function createNestApp() {
  const app = await NestFactory.create(AppModule);
  app.get(ConfigService);
  const prismaService = app.get(PrismaService);

  await prismaService.$connect();
  prismaService.enableShutdownHooks();
  app.enableShutdownHooks();

  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*', credentials: true });

  app.useGlobalPipes(new ValidationPipe());

  return app;
}
