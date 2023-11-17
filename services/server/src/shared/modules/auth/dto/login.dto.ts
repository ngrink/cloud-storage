import { Account } from '@/shared/modules/accounts';
import { IntersectionType } from '@nestjs/swagger';
import { RequestDto } from './request.dto';

export class LoginBodyDto {
  login: string;
  password: string;
  code?: string;
}

export class LoginDto extends IntersectionType(LoginBodyDto, RequestDto) {}

export class LoginResponseDto {
  account: Account;
  accessToken: string;
  refreshToken: string;
}
