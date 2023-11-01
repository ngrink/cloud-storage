import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AccountsRepository } from './accounts.repository';
import { AccountException } from './accounts.exception';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async createAccount(data: CreateAccountDto) {
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

    return account;
  }

  async getAccounts() {
    const accounts = await this.accountsRepository.getAccounts();

    return accounts;
  }

  async getAccount(accountId: number) {
    const account = await this.accountsRepository.getAccount(accountId);
    if (!account) {
      throw AccountException.AccountNotFound();
    }

    return account;
  }

  async getAccountByEmail(email: string) {
    const account = await this.accountsRepository.getAccountByEmail(email);
    if (!account) {
      throw AccountException.AccountNotFound();
    }

    return account;
  }

  async updateProfile(accountId: number, profile: UpdateProfileDto) {
    const account = await this.accountsRepository.updateProfile(
      accountId,
      profile,
    );
    if (!account) {
      throw AccountException.AccountNotFound();
    }
  }

  async deleteAccount(accountId: number) {
    await this.accountsRepository.deleteAccount(accountId);
  }
}
