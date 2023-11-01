import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Account } from './entities/account.entity';
import { Profile } from './entities/profile.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AccountDto } from './dto/account.dto';

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountModel: Repository<Account>,
    @InjectRepository(Profile)
    private readonly profileModel: Repository<Profile>,
  ) {}

  async createAccount(data: CreateAccountDto) {
    const profile = this.profileModel.create({
      ...data,
    });
    const account = this.accountModel.create({
      ...data,
      profile: profile,
    });
    await this.accountModel.save(account);

    return new AccountDto(account);
  }

  async getAccounts() {
    const result = await this.accountModel.find();
    const accounts = result.map((account) => new AccountDto(account));

    return accounts;
  }

  async getAccount(accountId: number) {
    const account = await this.accountModel.findOneBy({ id: accountId });
    if (!account) {
      return null;
    }

    return new AccountDto(account);
  }

  async getAccountByEmail(email: string) {
    const account = await this.accountModel.findOneBy({ email });
    if (!account) {
      return null;
    }

    return new AccountDto(account);
  }

  async updateProfile(accountId: number, profile: UpdateProfileDto) {
    const account = await this.accountModel.findOneBy({ id: accountId });
    if (!account) {
      return null;
    }

    Object.assign(account, { profile });
    await account.save();
  }

  async deleteAccount(accountId: number) {
    await this.accountModel.softDelete({ id: accountId });
  }
}
