import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { Cookies } from '@/shared/decorators';
import { Account } from '@/shared/modules/accounts';

import { AuthService } from './auth.service';
import { AccessTokenDto, ClientDto, LoginDto } from './dto';
import { Authenticated, CurrentClient, CurrentUser } from './decorators';
import { refreshCookieOptions } from './config';
import { OAuthProvider } from './enums';
import {
  GithubGuard,
  GoogleGuard,
  SteamGuard,
  VKGuard,
  YandexGuard,
} from './guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*
    Login by credentials
  */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async loginByCredentials(
    @Body() loginDto: LoginDto,
    @CurrentClient() client: ClientDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { account, accessToken, refreshToken } =
      await this.authService.loginByCredentials(loginDto, client);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    return { account, accessToken };
  }

  // /*
  //   Login by link
  // */
  // @HttpCode(HttpStatus.OK)
  // @Post('login/link')
  // async loginByLink(
  //   @Query('token') token: string,
  //   @CurrentClient() client: ClientDto,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   const { account, accessToken, refreshToken } =
  //     await this.authService.log(token, client);

  //   res.cookie('refreshToken', refreshToken, refreshCookieOptions);
  //   return { account, accessToken };
  // }

  /*
    Logout
  */
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @Authenticated()
  async logout(
    @CurrentUser() account: AccessTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(account);

    res.clearCookie('refreshToken', refreshCookieOptions);
    return 'OK';
  }

  /*
    Refresh tokens
  */
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @CurrentClient() client: ClientDto,
    @Cookies('refreshToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(
      token,
      client,
    );

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    return { accessToken };
  }

  /*
    Login by Google
  */
  @Get('login/google')
  @UseGuards(GoogleGuard)
  async loginByGoogle() {}

  /*
    Login by Google (callback)
  */
  @Get('login/google/callback')
  @UseGuards(GoogleGuard)
  @ApiExcludeEndpoint()
  async loginByGoogleCallback(
    @CurrentUser() account: Account,
    @CurrentClient() client: ClientDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.loginByProvider(account, client);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    return { account, accessToken };
  }

  /*
    Login by Yandex
  */
  @Get('login/yandex')
  @UseGuards(YandexGuard)
  async loginByYandex() {}

  /*
    Login by Yandex (callback)
  */
  @Get('login/yandex/callback')
  @UseGuards(YandexGuard)
  @ApiExcludeEndpoint()
  async loginByYandexCallback(
    @CurrentUser() account: Account,
    @CurrentClient() client: ClientDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.loginByProvider(account, client);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    return { account, accessToken };
  }

  /*
    Login by VK
  */
  @Get('login/vk')
  @UseGuards(VKGuard)
  async loginByVK() {}

  /*
    Login by VK (callback)
  */
  @Get('login/vk/callback')
  @UseGuards(VKGuard)
  @ApiExcludeEndpoint()
  async loginByVKCallback(
    @CurrentUser() account: Account,
    @CurrentClient() client: ClientDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.loginByProvider(account, client);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    return { account, accessToken };
  }

  /*
    Login by Github
  */
  @Get('login/github')
  @UseGuards(GithubGuard)
  async loginByGithub() {}

  /*
    Login by Github (callback)
  */
  @Get('login/github/callback')
  @UseGuards(GithubGuard)
  @ApiExcludeEndpoint()
  async loginByGithubCallback(
    @CurrentUser() account: Account,
    @CurrentClient() client: ClientDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.loginByProvider(account, client);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    return { account, accessToken };
  }

  /*
    Login by Steam
  */
  @Get('login/steam')
  @UseGuards(SteamGuard)
  async loginBySteam() {}

  /*
    Login by Steam (callback)
  */
  @Get('login/steam/callback')
  @UseGuards(SteamGuard)
  @ApiExcludeEndpoint()
  async loginBySteamCallback(
    @CurrentUser() account: Account,
    @CurrentClient() client: ClientDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.loginByProvider(account, client);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    return { account, accessToken };
  }
}
