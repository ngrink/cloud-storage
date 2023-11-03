import { PickType, IntersectionType } from '@nestjs/swagger';

import { Account } from '@/modules/accounts';
import { Session } from '../entities';
import { RequestDto } from './request.dto';

export class AccessTokenDto extends IntersectionType(
  PickType(Account, ['id', 'email', 'roles', 'isVerified']),
  PickType(Session, ['clientId', 'userIP', 'userAgent']),
) {
  constructor(account: Account, data: Session | RequestDto) {
    super();
    this.id = account.id;
    this.email = account.email;
    this.roles = account.roles;
    this.isVerified = account.isVerified;
    this.clientId = data.clientId;
    this.userIP = data.userIP;
    this.userAgent = data.userAgent;
  }
}

export class RefreshTokenDto extends IntersectionType(
  PickType(Account, ['id']),
  PickType(Session, ['clientId', 'userIP', 'userAgent']),
) {
  constructor(account: Account, data: Session | RequestDto) {
    super();
    this.id = account.id;
    this.clientId = data.clientId;
    this.userIP = data.userIP;
    this.userAgent = data.userAgent;
  }
}
