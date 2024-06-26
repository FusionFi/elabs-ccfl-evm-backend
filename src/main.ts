import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from 'src/config/config.service';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';
import helmet from 'helmet';

async function bootstrap() {
  const transports = {
    console: new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.colorize({
          colors: {
            info: 'blue',
            debug: 'yellow',
            error: 'red',
          },
        }),
        winston.format.printf((info) => {
          return `${info.timestamp} [${info.level}] ${info.message} [${
            info.context ? JSON.stringify(info.context, null, 2) : info.stack
          }]`;
        }),
        // winston.format.align(),
      ),
    }),
    combinedFile: new winstonDailyRotateFile({
      dirname: ConfigService.Logger.folder,
      filename: 'app',
      extension: '.log',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf((info: any) => {
          return `${info.timestamp} [${info.level}] ${info.message} [${
            info.context ? JSON.stringify(info.context) : info.stack
          }]`;
        }),
      ),
    }),
    errorFile: new winstonDailyRotateFile({
      dirname: ConfigService.Logger.folder,
      filename: 'error',
      extension: '.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf((info: any) => {
          return `${info.timestamp} [${info.level}] [${
            info.context ? info.context : info.stack
          }] ${info.message}`;
        }),
      ),
    }),
  };

  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
    // logger: ['error', 'warn', 'log'],
    logger: WinstonModule.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      transports: [
        transports.console,
        transports.combinedFile,
        transports.errorFile,
      ],
    }),
  });

  app.enableCors({
    exposedHeaders: ['Content-Disposition'],
    origin: ConfigService.Cors.origin,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('ELABS')
    .setDescription('The ELABS API description')
    .setVersion('1.0')
    .addTag('elabs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(ConfigService.App.port);
}

bootstrap();
