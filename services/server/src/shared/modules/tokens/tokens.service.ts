import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokensService {
  constructor(private readonly configService: ConfigService) {}

  generateAccessToken(payload: object) {
    return jwt.sign(payload, this.configService.get('JWT_ACCESS_SECRET'), {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(payload: object) {
    return jwt.sign(payload, this.configService.get('JWT_REFRESH_SECRET'), {
      expiresIn: '90d',
    });
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, this.configService.get('JWT_ACCESS_SECRET'));
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, this.configService.get('JWT_REFRESH_SECRET'));
  }
}
