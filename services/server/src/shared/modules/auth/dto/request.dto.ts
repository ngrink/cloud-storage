import { PickType } from '@nestjs/swagger';
import { Session } from '../entities';

export class RequestDto extends PickType(Session, [
  'clientId',
  'userIP',
  'userAgent',
] as const) {}
