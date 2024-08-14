import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from 'src/config/config.service';
import { ValidationPipe, Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
// import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import * as winston from 'winston';
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';
import helmet from 'helmet';
import { resolve } from 'path';

async function bootstrap() {
  const logger = new Logger('HTTP');

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

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
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

  app.useStaticAssets(resolve('./public'));
  app.setBaseViewsDir(resolve('./views'));
  app.setViewEngine('hbs');

  app.enableCors({
    exposedHeaders: ['Content-Disposition'],
    origin: ConfigService.Cors.origin,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new HttpExceptionFilter());
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
  logger.log(`Starting server at port ${ConfigService.App.port}`);
}

bootstrap();
