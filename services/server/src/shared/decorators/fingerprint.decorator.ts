import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Fingerprint = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    return req.get('X-Fingerprint');
  },
);
