import { ClientDto } from '@/shared/modules/auth';
import { PickType, IntersectionType } from '@nestjs/swagger';

import { Account } from '@/shared/modules/accounts';
import { Session } from '../entities';

export class AccessTokenDto extends IntersectionType(
  PickType(Account, ['id', 'email', 'roles', 'isVerified']),
  PickType(Session, ['clientId', 'userIP', 'userAgent']),
) {
  constructor(account: Account, session: Session) {
    super();
    this.id = account.id;
    this.email = account.email;
    this.roles = account.roles;
    this.isVerified = account.isVerified;
    this.clientId = session.clientId;
    this.userIP = session.userIP;
    this.userAgent = session.userAgent;
  }
}

export class RefreshTokenDto extends IntersectionType(
  PickType(Account, ['id']),
  PickType(Session, ['clientId', 'userIP', 'userAgent']),
) {
  constructor(account: Account, session: Session) {
    super();
    this.id = account.id;
    this.clientId = session.clientId;
    this.userIP = session.userIP;
    this.userAgent = session.userAgent;
  }
}
