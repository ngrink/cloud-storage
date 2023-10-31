import { OmitType } from '@nestjs/swagger';
import { Account } from '../entities/account.entity';

export class AccountDto extends OmitType(Account, ['password'] as const) {
  constructor(account: any) {
    super();
    this.id = account.id;
    this.email = account.email;
    this.roles = account.roles;
    this.isVerified = account.isVerified;
    this.profile = account.profile;
    this.deletedAt = account.deletedAt;
  }
}
