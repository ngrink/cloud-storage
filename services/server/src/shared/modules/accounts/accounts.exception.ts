import { BadRequestException, NotFoundException } from '@nestjs/common';

export class AccountException {
  static AccountEmailExists() {
    return new BadRequestException('Account with that email already exists');
  }

  static AccountNotFound() {
    return new NotFoundException('Account not found');
  }

  static PasswordsNotMatch() {
    return new BadRequestException('Passwords do not match');
  }
}
