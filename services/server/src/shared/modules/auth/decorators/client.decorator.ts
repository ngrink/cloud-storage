import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { ClientDto } from '../dto';

export const CurrentClient = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const client: ClientDto = {
      id: request.get('X-Client-Id'),
      ip: request.ip,
      useragent: request.get('User-Agent'),
    };

    return key ? client?.[key] : client;
  },
);
