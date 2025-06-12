import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  if (!port) {
    throw new Error(
      'PORT environment variable is not defined. Please set it in your .env file or environment.',
    );
  }

  await app.listen(port);
}
bootstrap();
