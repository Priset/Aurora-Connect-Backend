import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT') ?? 3000;

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 5000);
  console.log(`🚀 Server running on http://localhost:${port}/api`);
}
bootstrap();
