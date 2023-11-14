import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import urlcat from 'urlcat';

import { MailService } from '@/shared/modules/mail';

import { AccountsRepository } from './accounts.repository';
import { AccountException } from './accounts.exception';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AccountsService {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly mailService: MailService,
  ) {}

  async createAccount(data: CreateAccountDto): Promise<Account> {
    const candidate = await this.accountsRepository.getAccountByEmail(
      data.email,
    );
    if (candidate) {
      throw AccountException.AccountEmailExists();
    }

    if (data.password !== data.passwordConfirm) {
      throw AccountException.PasswordsNotMatch();
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const account = await this.accountsRepository.createAccount({
      ...data,
      password: hashedPassword,
    });

    this.eventEmitter.emit('account.created', account);
    return account;
  }

  async getAccounts(): Promise<Account[]> {
    const accounts = await this.accountsRepository.getAccounts();

    return accounts;
  }

  async getAccount(accountId: number): Promise<Account> {
    const account = await this.accountsRepository.getAccount(accountId);
    if (!account) {
      throw AccountException.AccountNotFound();
    }

    return account;
  }

  async getAccountByEmail(email: string): Promise<Account> {
    const account = await this.accountsRepository.getAccountByEmail(email);
    if (!account) {
      throw AccountException.AccountNotFound();
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
      throw AccountException.AccountNotFound();
    }

    return account;
  }

  async deleteAccount(accountId: number): Promise<void> {
    await this.accountsRepository.deleteAccount(accountId);
  }

  async verifyEmail(token: string): Promise<string> {
    const tokenDB = await this.accountsRepository.getVerificationToken(token);
    if (!tokenDB) {
      throw AccountException.VerificationTokenNotFound();
    }

    tokenDB.verifiedAt = new Date();

    const account = await this.accountsRepository.getAccount(tokenDB.accountId);
    account.isVerified = true;

    Promise.all([await tokenDB.save(), await account.save()]);

    return 'OK';
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
