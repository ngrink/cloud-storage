import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';

import { AccountsService, CreateAccountDto } from '@/shared/modules/accounts';
import { OAuthProvider } from '../../enums';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor(
    private readonly configService: ConfigService,
    private readonly accountsService: AccountsService,
  ) {
    super({
      realm: configService.get<string>('SERVICE_URL'),
      apiKey: configService.get<string>('OAUTH_STEAM_CLIENT_SECRET'),
      returnURL: configService.get<string>('OAUTH_STEAM_CALLBACK_URL'),
    });
  }

  async validate(
    identifier: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const data: CreateAccountDto = {
      fullname: profile._json.realname,
      email: null,
      avatar: profile._json.avatarfull,

      provider: OAuthProvider.STEAM,
      providerSub: profile.id,
    };

    let account = await this.accountsService
      .getAccountByProvider(data.provider, data.providerSub)
      .catch(() => null);
    if (!account) {
      account = await this.accountsService.createAccountByProvider(data);
    }

    done(null, account);
  }
}
