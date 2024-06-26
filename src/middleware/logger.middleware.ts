import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    let realIp;
    try {
      realIp =
        request.get('cf-connecting-ip') ||
        request.get('x-forwarded-for') ||
        request.get('x_forwarded_for') ||
        request.get('x-client') ||
        request.ip;
    } catch (err) {
      this.logger.warn(err);
      realIp = ip;
    }

    const startTime = new Date().getTime();
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const processTime = new Date().getTime() - startTime;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${processTime} ${contentLength} ${realIp} ${userAgent}`,
      );
    });

    next();
  }
}
