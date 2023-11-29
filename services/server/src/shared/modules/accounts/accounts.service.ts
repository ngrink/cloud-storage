import { ResetPasswordDto } from './dto/reset-password.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import urlcat from 'urlcat';

import { MailService } from '@/shared/modules/mail';

import { AccountsRepository } from './accounts.repository';
import { AccountsException } from './accounts.exception';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { OAuthProvider } from '../auth';

@Injectable()
export class AccountsService {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly mailService: MailService,
  ) {}

  async createAccount(data: CreateAccountDto): Promise<Account> {
    if (data.email) {
      const candidate = await this.accountsRepository.getAccountByEmail(
        data.email,
      );
      if (candidate) {
        throw AccountsException.AccountEmailExists();
      }
    }

    if (data.password && data.password !== data.passwordConfirm) {
      throw AccountsException.PasswordsNotMatch();
    }

    const hashedPassword = !data.provider
      ? await bcrypt.hash(data.password, 10)
      : null;

    const account = await this.accountsRepository.createAccount({
      ...data,
      password: hashedPassword,
    });

    this.eventEmitter.emit('account.created', account);
    return account;
  }

  async createAccountByProvider(data: CreateAccountDto): Promise<Account> {
    const account = await this.createAccount(data);

    return account;
  }

  async getAccounts(): Promise<Account[]> {
    const accounts = await this.accountsRepository.getAccounts();

    return accounts;
  }

  async getAccount(accountId: number): Promise<Account> {
    const account = await this.accountsRepository.getAccount(accountId);
    if (!account) {
      throw AccountsException.AccountNotFound();
    }

    return account;
  }

  async getAccountByEmail(email: string): Promise<Account> {
    const account = await this.accountsRepository.getAccountByEmail(email);
    if (!account) {
      throw AccountsException.AccountNotFound();
    }

    return account;
  }

  async getAccountByProvider(
    provider: OAuthProvider,
    providerSub: string,
  ): Promise<Account> {
    const account = await this.accountsRepository.getAccountByProvider(
      provider,
      providerSub,
    );
    if (!account) {
      throw AccountsException.AccountNotFound();
    }

    return account;
  }

  async updateProfile(
    accountId: number,
    profile: UpdateProfileDto,
  ): Promise<Account> {
    const account = await this.accountsRepository.updateProfile(
      accountId,
      profile,
    );
    if (!account) {
      throw AccountsException.AccountNotFound();
    }

    return account;
  }

  async updatePassword(data: UpdatePasswordDto): Promise<Account> {
    const account = await this.accountsRepository.getAccount(data.accountId);
    if (!account) {
      throw AccountsException.AccountNotFound();
    }

    const isMatch = await bcrypt.compare(
      data.currentPassword,
      account.password,
    );
    if (!isMatch) {
      throw AccountsException.PasswordsNotMatch();
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    const updatedAccount = await this.accountsRepository.updatePassword(
      account.id,
      hashedPassword,
    );

    return updatedAccount;
  }

  async deleteAccount(accountId: number): Promise<void> {
    await this.accountsRepository.deleteAccount(accountId);
  }

  async verifyEmail(token: string): Promise<string> {
    const tokenDB = await this.accountsRepository.getVerificationToken(token);
    if (!tokenDB) {
      throw AccountsException.VerificationTokenNotFound();
    }

    tokenDB.verifiedAt = new Date();

    const account = await this.accountsRepository.getAccount(tokenDB.accountId);
    account.isVerified = true;

    Promise.all([await tokenDB.save(), await account.save()]);

    return 'OK';
  }

  async updateEmailRequest(accountId: number, email: string) {
    const account = await this.accountsRepository.getAccount(accountId);
    if (!account) {
      throw AccountsException.AccountNotFound();
    }

    const candidate = await this.accountsRepository.getAccountByEmail(email);
    if (candidate) {
      throw AccountsException.AccountEmailExists();
    }

    const token = uuid.v4();
    const link = urlcat(
      this.configService.get('API_URL'),
      `/accounts/email/confirm`,
      {
        token,
        _method: 'PATCH',
      },
    );

    await this.accountsRepository.createEmailUpdate(accountId, email, token);
    this.mailService.sendEmailUpdateMail(account.email, email, link);
  }

  async updateEmailConfirm(token: string) {
    const updateEmail = await this.accountsRepository.getEmailUpdate(token);
    if (!updateEmail) {
      throw AccountsException.EmailUpdateTokenNotFound();
    }
    const { accountId, email } = updateEmail;
    const account = await this.accountsRepository.updateEmail(accountId, email);
    updateEmail.remove();

    return account;
  }

  async updateEmail(accountId: number, email: string): Promise<Account> {
    const account = await this.accountsRepository.updateEmail(accountId, email);

    return account;
  }

  async requestResetPassword(email: string): Promise<string> {
    const account = await this.accountsRepository.getAccountByEmail(email);
    if (!account) {
      return;
    }

    const token = `${uuid.v4()}`;
    const link = urlcat(
      this.configService.get('WEB_URL'),
      'accounts/password/reset',
      { token },
    );

    await this.accountsRepository.createPasswordReset(account.id, token);
    await this.mailService.sendPasswordResetMail(account, link);
  }

  async resetPassword(data: ResetPasswordDto): Promise<void> {
    const passwordReset = await this.accountsRepository.getPasswordReset(
      data.token,
    );
    if (!passwordReset) {
      throw AccountsException.PasswordResetTokenNotFound();
    }
    if (Date.now() - passwordReset.createdAt > 1000 * 60 * 60 * 6) {
      throw AccountsException.PasswordResetTokenExpired();
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await Promise.all([
      await this.accountsRepository.updatePassword(
        passwordReset.accountId,
        hashedPassword,
      ),
      await passwordReset.remove(),
    ]);
  }

  @OnEvent('account.created')
  async createAndSendVerificationToken(account: Account) {
    const { token } = await this.accountsRepository.createVerificationToken(
      account.id,
      uuid.v4(),
    );

    const verificationLink = urlcat(
      this.configService.get('API_URL'),
      '/accounts/email/verify',
      {
        token,
        _method: 'POST',
      },
    );

    await this.mailService.sendEmailVerificationMail(account, verificationLink);
  }
}
