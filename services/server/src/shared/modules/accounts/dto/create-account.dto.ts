import { IntersectionType, PickType } from '@nestjs/swagger';
import { Account } from '../entities/account.entity';
import { Profile } from '../entities/profile.entity';

export class PasswordConfirm {
  passwordConfirm: string;
}

export class CreateAccountDto extends IntersectionType(
  PickType(Profile, ['fullname'] as const),
  PickType(Account, ['email', 'password'] as const),
  PasswordConfirm,
) {}
