import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { UserAgent, Fingerprint, Cookies } from '@/shared/decorators';

import { AuthService } from './auth.service';
import { LoginBodyDto, AccessTokenDto } from './dto';
import { Authenticated, User } from './decorators';
import { refreshCookieOptions } from './config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginBodyDto: LoginBodyDto,
    @Query() query: object,
    @Fingerprint() clientId: string,
    @Ip() userIP: string,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { account, accessToken, refreshToken } = await this.authService.login(
      { ...loginBodyDto, clientId, userIP, userAgent },
    );

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    return { account, accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @Authenticated()
  async logout(
    @User() user: AccessTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user);

    res.clearCookie('refreshToken', refreshCookieOptions);
    return 'OK';
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Fingerprint() clientId: string,
    @Cookies('refreshToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(
      clientId,
      token,
    );

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    return { accessToken };
  }
}
