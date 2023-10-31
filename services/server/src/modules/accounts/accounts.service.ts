import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AccountException } from './accounts.exception';
import { Account } from './entities/account.entity';
import { Profile } from './entities/profile.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AccountDto } from './dto/account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createAccount(data: CreateAccountDto) {
    const candidate = await this.accountRepository.findOneBy({
      email: data.email,
    });
    if (candidate) {
      throw AccountException.AccountEmailExists();
    }

    if (data.password !== data.passwordConfirm) {
      throw AccountException.PasswordsNotMatch();
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const profile = this.profileRepository.create({
      ...data,
    });
    const account = this.accountRepository.create({
      ...data,
      password: hashedPassword,
      profile: profile,
    });
    await this.accountRepository.save(account);

    return new AccountDto(account);
  }

  async getAccounts() {
    const result = await this.accountRepository.find();
    const accounts = result.map((account) => new AccountDto(account));

    return accounts;
  }

  async getAccount(accountId: number) {
    const account = await this.accountRepository.findOneBy({ id: accountId });
    if (!account) {
      throw AccountException.AccountNotFound();
    }

    return new AccountDto(account);
  }

  async getAccountByEmail(email: string) {
    const account = await this.accountRepository.findOneBy({ email });
    if (!account) {
      throw AccountException.AccountNotFound();
    }

    return new AccountDto(account);
  }

  async updateProfile(accountId: number, profile: UpdateProfileDto) {
    const account = await this.accountRepository.findOneBy({ id: accountId });
    if (!account) {
      throw AccountException.AccountNotFound();
    }

    Object.assign(account, { profile });
    await account.save();
  }

  async deleteAccount(accountId: number) {
    await this.accountRepository.softDelete({ id: accountId });
  }
}
