import { AccountsService, CreateAccountDto } from '@/shared/modules/accounts';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { OAuthProvider } from '../../enums';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly accountsService: AccountsService,
  ) {
    super({
      clientID: configService.get<string>('OAUTH_GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('OAUTH_GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('OAUTH_GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const data: CreateAccountDto = {
      fullname: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value,

      provider: OAuthProvider.GITHUB,
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
