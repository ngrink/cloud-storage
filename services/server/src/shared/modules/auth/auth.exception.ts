import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export class AuthException {
  static BadCredentials() {
    return new BadRequestException('Login or password is wrong');
  }

  static Unauthorized() {
    return new UnauthorizedException();
  }

  static UnknownСlient() {
    return new BadRequestException('Unknown client');
  }
}
