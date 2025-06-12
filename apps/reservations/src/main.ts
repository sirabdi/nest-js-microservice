import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);

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
