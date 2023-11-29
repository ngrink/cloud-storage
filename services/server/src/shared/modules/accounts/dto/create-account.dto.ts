import { IntersectionType, PickType } from '@nestjs/swagger';

import { OAuthProvider } from '@/shared/modules/auth';
import { Account } from '../entities/account.entity';
import { Profile } from '../entities/profile.entity';

export class PasswordConfirm {
  passwordConfirm?: string;
}

export class ProviderData {
  provider?: OAuthProvider = null;
  providerSub?: string = null;
}

export class CreateAccountDto extends IntersectionType(
  PickType(Profile, ['fullname', 'avatar'] as const),
  PickType(Account, ['email', 'password'] as const),
  PasswordConfirm,
  ProviderData,
) {}
