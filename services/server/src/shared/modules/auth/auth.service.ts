import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import urlcat from 'urlcat';

import { TokensService } from '@/shared/modules/tokens';
import { AccountsService, Account } from '@/shared/modules/accounts';
import { TfaService } from '@/shared/modules/tfa';

import { AuthException } from './auth.exception';
import { Session } from './entities';
import { SessionsRepository } from './repositories';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { AccessTokenDto, RefreshTokenDto } from './dto/tokens.dto';
import { ClientDto } from './dto/client.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly accountsService: AccountsService,
    private readonly tokensService: TokensService,
    private readonly tfaService: TfaService,
    private readonly sessionRepository: SessionsRepository,
  ) {}

  async login(account: Account, client: ClientDto): Promise<LoginResponseDto> {
    const session = await this.sessionRepository.createSession(account, client);
    const tokens = this.generateTokens(account, session);

    session.refreshToken = tokens.refreshToken;
    await session.save();

    return { account, ...tokens };
  }

  async loginByCredentials(
    loginDto: LoginDto,
    client: ClientDto,
  ): Promise<LoginResponseDto> {
    const { login, password, code } = loginDto;
    const account = await this.checkCredentials(login, password, code);

    return await this.login(account, client);
  }

  async loginByLink(
    token: string,
    client: ClientDto,
  ): Promise<LoginResponseDto> {
    const data = this.tokensService.verify(token) as any;
    const account = await this.accountsService.getAccount(data.accountId);

    return await this.login(account, client);
  }

  async loginByProvider(
    account: Account,
    client: ClientDto,
  ): Promise<LoginResponseDto> {
    return await this.login(account, client);
  }

  async logout(user: AccessTokenDto): Promise<void> {
    await this.sessionRepository.deleteSession(user.id, user.clientId);
    // TODO: invalidate tokens
  }

  async refresh(token: string, client: ClientDto): Promise<any> {
    const payload = this.tokensService.verifyRefreshToken(token);
    if (!payload) {
      throw AuthException.Unauthorized();
    }

    const isClientValid = this.checkClient(client, payload as RefreshTokenDto);
    if (!isClientValid) {
      throw AuthException.UnknownСlient();
    }

    const session =
      await this.sessionRepository.getSessionByRefreshToken(token);
    if (!session) {
      throw AuthException.Unauthorized();
    }

    const account = await this.accountsService.getAccount(session.accountId);
    const tokens = this.generateTokens(account, session);

    await this.sessionRepository.updateSession(account.id, session.clientId, {
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async generateLoginLink(accountId: number) {
    const token = this.tokensService.generate(
      { accountId },
      { expiresIn: '10m' },
    );
    const link = urlcat(this.configService.get('API_URL'), '/auth/login/link', {
      token,
      _method: 'POST',
    });

    return link;
  }

  private async checkCredentials(
    login: string,
    password: string,
    code: string,
  ): Promise<Account> {
    const account: Account = await this.accountsService
      .getAccountByEmail(login)
      .catch((error) => {
        if (error instanceof HttpException) return null;
        throw error;
      });
    if (!account) {
      throw AuthException.BadCredentials();
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      throw AuthException.BadCredentials();
    }

    const factor = await this.tfaService.getFactor(account.id);
    if (factor) {
      await this.tfaService.verifyFactor(factor, code);
    }

    return account;
  }

  private checkClient(
    client: Partial<ClientDto>,
    payload: AccessTokenDto | RefreshTokenDto,
  ): boolean {
    if (
      (client.id && client.id !== payload.clientId) ||
      (client.ip && client.ip !== payload.userIP) ||
      (client.useragent && client.useragent !== payload.userAgent)
    ) {
      return false;
    }

    return true;
  }

  private generateTokens(account: Account, session: Session) {
    const accessToken = this.tokensService.generateAccessToken({
      ...new AccessTokenDto(account, session),
    });
    const refreshToken = this.tokensService.generateRefreshToken({
      ...new RefreshTokenDto(account, session),
    });

    return { accessToken, refreshToken };
  }
}
