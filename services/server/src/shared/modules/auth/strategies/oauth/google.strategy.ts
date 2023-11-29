import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

import { AccountsService, CreateAccountDto } from '@/shared/modules/accounts';
import { OAuthProvider } from '../../enums';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly accountService: AccountsService,
  ) {
    super({
      clientID: configService.get<string>('OAUTH_GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('OAUTH_GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('OAUTH_GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const data: CreateAccountDto = {
      fullname: `${name.familyName} ${name.givenName}`,
      avatar: photos[0].value,
      email: emails[0].value,

      provider: OAuthProvider.GOOGLE,
      providerSub: profile.id,
    };

    let account = await this.accountService
      .getAccountByProvider(data.provider, data.providerSub)
      .catch(() => null);
    if (!account) {
      account = await this.accountService.createAccountByProvider(data);
    }

    done(null, account);
  }
}
