import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { options } from 'joi';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  const port = configService.get<number>('HTTP_PORT');

  if (!port) {
    throw new Error(
      'HTTP_PORT environment variable is not defined. Please set it in your .env file or environment.',
    );
  }

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
