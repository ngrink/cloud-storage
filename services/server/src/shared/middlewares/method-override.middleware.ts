import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MethodOverrideMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const availableMethods = [
      'POST',
      'GET',
      'PATCH',
      'PUT',
      'DELETE',
      'HEAD',
      'OPTIONS',
    ];

    const method = req.query?._method as string;
    if (method && availableMethods.includes(method.toUpperCase())) {
      req.method = method.toUpperCase();
    }

    next();
  }
}
