import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-vkontakte';

import { AccountsService, CreateAccountDto } from '@/shared/modules/accounts';
import { OAuthProvider } from '../../enums';

@Injectable()
export class VKStrategy extends PassportStrategy(Strategy, 'vkontakte') {
  constructor(
    private readonly configService: ConfigService,
    private readonly accountsService: AccountsService,
  ) {
    super(
      {
        clientID: configService.get<string>('OAUTH_VK_CLIENT_ID'),
        clientSecret: configService.get<string>('OAUTH_VK_CLIENT_SECRET'),
        callbackURL: configService.get<string>('OAUTH_VK_CALLBACK_URL'),
        scope: ['email'],
        lang: 'ru',
      },
      async function validate(
        accessToken: string,
        refreshToken: string,
        params: any,
        profile: any,
        done: VerifyCallback,
      ): Promise<any> {
        const data: CreateAccountDto = {
          fullname: profile.displayName,
          email: params.email,
          avatar: profile.photos[0].value,

          provider: OAuthProvider.VK,
          providerSub: profile.id,
        };

        let account = await accountsService
          .getAccountByProvider(data.provider, data.providerSub)
          .catch(() => null);
        if (!account) {
          account = await accountsService.createAccountByProvider(data);
        }

        done(null, account);
      },
    );
  }
}
