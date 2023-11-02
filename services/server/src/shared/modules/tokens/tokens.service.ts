import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokensService {
  private readonly isProduction =
    this.configService.get('NODE_ENV') == 'production';

  constructor(private readonly configService: ConfigService) {}

  generateAccessToken(payload: object) {
    return jwt.sign(payload, this.configService.get('JWT_ACCESS_SECRET'), {
      expiresIn: this.isProduction ? '15m' : '1d',
    });
  }

  generateRefreshToken(payload: object) {
    return jwt.sign(payload, this.configService.get('JWT_REFRESH_SECRET'), {
      expiresIn: '90d',
    });
  }

  verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, this.configService.get('JWT_ACCESS_SECRET'));
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, this.configService.get('JWT_REFRESH_SECRET'));
    } catch (error) {
      return null;
    }
  }
}
