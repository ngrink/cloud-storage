import { Account } from '@/shared/modules/accounts';

export class LoginDto {
  login: string;
  password: string;
  code?: string;
}

export class LoginResponseDto {
  account: Account;
  accessToken: string;
  refreshToken: string;
}
