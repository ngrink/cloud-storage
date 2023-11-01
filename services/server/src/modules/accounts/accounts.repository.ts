import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

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
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async createAccount(data: CreateAccountDto) {
    const profile = this.profileModel.create({
      ...data,
    });
    const account = this.accountModel.create({
      ...data,
      profile: profile,
    });
    const accountDto = await this.accountModel
      .save(account)
      .then((account) => new AccountDto(account));

    await Promise.all([
      this.cacheManager.set(`accounts:${account.id}`, accountDto),
      this.cacheManager.set(`accounts:${account.email}`, accountDto),
    ]);

    return accountDto;
  }

  async getAccounts() {
    const cachedAccounts = await this.cacheManager.get('accounts');
    if (cachedAccounts) {
      return cachedAccounts;
    }

    const result = await this.accountModel.find();
    const accounts = result.map((account) => new AccountDto(account));

    await this.cacheManager.set('accounts', accounts);

    return accounts;
  }

  async getAccount(accountId: number) {
    const cachedAccount = await this.cacheManager.get(`accounts:${accountId}`);
    if (cachedAccount) {
      return cachedAccount;
    }

    const account = await this.accountModel.findOneBy({ id: accountId });
    if (!account) {
      return null;
    }

    const accountDto = new AccountDto(account);
    await this.cacheManager.set(`accounts:${accountId}`, accountDto);

    return accountDto;
  }

  async getAccountByEmail(email: string) {
    const cachedAccount = await this.cacheManager.get(`accounts:${email}`);
    if (cachedAccount) {
      return cachedAccount;
    }

    const account = await this.accountModel.findOneBy({ email });
    if (!account) {
      return null;
    }

    const accountDto = new AccountDto(account);
    await this.cacheManager.set(`accounts:${email}`, accountDto);

    return accountDto;
  }

  async updateProfile(accountId: number, profile: UpdateProfileDto) {
    const account = await this.accountModel.findOneBy({ id: accountId });
    if (!account) {
      return null;
    }

    Object.assign(account, { profile });
    await account.save();
    await this.cacheManager.del(`accounts:${accountId}`);
  }

  async deleteAccount(accountId: number) {
    await this.accountModel.softDelete({ id: accountId });
    await this.cacheManager.del(`accounts:${accountId}`);
  }
}
