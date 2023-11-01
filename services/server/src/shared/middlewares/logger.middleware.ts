import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as chalk from 'chalk';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('close', () => {
      const { ip, method, path, httpVersion } = req;
      const { statusCode } = res;
      const referer = req.headers['referer'] || '-';
      const userAgent = req.headers['user-agent'] || '-';
      const contentLength = res.get('content-length');

      const code = styleStatusCode(statusCode);
      const message =
        this.configService.get('NODE_ENV') === 'production'
          ? `"${method} ${path} HTTP/${httpVersion}" ${code} ${contentLength} ${referer} ${ip} ${userAgent}`
          : `"${method} ${path} HTTP/${httpVersion}" ${code} ${contentLength}`;

      if (statusCode < 500) {
        this.logger.log(message);
      } else {
        this.logger.error(message);
      }
    });

    next();
  }
}

function styleStatusCode(code: number): string {
  if (code < 400) {
    return chalk.bgGreen(code);
  } else if (code >= 400 && code < 500) {
    return chalk.bgYellow(code);
  } else {
    return chalk.bgRed(code);
  }
}
