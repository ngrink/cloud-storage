import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { TokensService } from '@/shared/modules/tokens';
import { AccountsService, Account } from '@/modules/accounts';

import { AuthException } from './auth.exception';
import { SessionsRepository } from './repositories/session.repository';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { AccessTokenDto, RefreshTokenDto } from './dto/tokens.dto';
import { Session } from './entities';
import { RequestDto } from './dto/request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly tokensService: TokensService,
    private readonly sessionRepository: SessionsRepository,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { login, password } = loginDto;
    const account = await this.checkCredentials(login, password);
    const tokens = this.generateTokens(account, loginDto);
    await this.sessionRepository.createSession(
      account,
      loginDto,
      tokens.refreshToken,
    );

    return { account, ...tokens };
  }

  async logout(user: AccessTokenDto): Promise<void> {
    await this.sessionRepository.deleteSession(user.id, user.clientId);
  }

  async refresh(clientId: string, refreshToken: string): Promise<any> {
    const payload = this.tokensService.verifyRefreshToken(
      refreshToken,
    ) as RefreshTokenDto;
    if (!payload) {
      throw AuthException.Unauthorized();
    }

    const isClientValid = this.checkClient({ clientId }, payload);
    if (!isClientValid) {
      throw AuthException.UnknownСlient();
    }

    const session =
      await this.sessionRepository.getSessionByRefreshToken(refreshToken);
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

  private async checkCredentials(
    login: string,
    password: string,
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

    return account;
  }

  private checkClient(
    request: Partial<RequestDto>,
    payload: AccessTokenDto | RefreshTokenDto,
  ): boolean {
    const { clientId, userAgent, userIP } = request;
    if (
      (clientId && clientId !== payload.clientId) ||
      (userAgent && userAgent !== payload.userAgent) ||
      (userIP && userIP !== payload.userIP)
    ) {
      return false;
    }

    return true;
  }

  private generateTokens(account: Account, session: Session | RequestDto) {
    const accessToken = this.tokensService.generateAccessToken({
      ...new AccessTokenDto(account, session),
    });
    const refreshToken = this.tokensService.generateRefreshToken({
      ...new RefreshTokenDto(account, session),
    });

    return { accessToken, refreshToken };
  }
}
