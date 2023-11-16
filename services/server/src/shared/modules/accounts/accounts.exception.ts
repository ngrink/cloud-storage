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

  static VerificationTokenNotFound() {
    return new NotFoundException('Verification token not found');
  }

  static PasswordResetTokenNotFound() {
    return new NotFoundException('Password reset token not found');
  }

  static PasswordResetTokenExpired() {
    return new BadRequestException('Password reset token expired');
  }

  static EmailUpdateTokenNotFound() {
    return new NotFoundException('Email update token not found');
  }

  static EmailUpdateTokenExpired() {
    return new BadRequestException('Email update token expired');
  }
}
