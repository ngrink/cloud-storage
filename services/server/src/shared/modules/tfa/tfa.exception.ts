import { BadRequestException } from '@nestjs/common';

export class TfaException {
  static FactorNotFound() {
    return new BadRequestException('2FA for this user not found');
  }

  static FactorExists() {
    return new BadRequestException('2FA for this user already exists');
  }

  static InvalidCode() {
    return new BadRequestException('2FA code is wrong');
  }

  static RequiredCode() {
    return new BadRequestException('2FA code is required');
  }
}
