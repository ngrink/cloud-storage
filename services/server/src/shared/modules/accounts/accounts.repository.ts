import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { Account } from './entities/account.entity';
import { Profile } from './entities/profile.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  async createAccount(data: CreateAccountDto): Promise<Account> {
    const profile = this.profileModel.create({
      ...data,
    });
    const account = this.accountModel.create({
      ...data,
      profile: profile,
    });
    await this.accountModel.save(account);

    await Promise.all([
      this.cacheManager.set(`accounts:${account.id}`, account),
      this.cacheManager.set(`accounts:${account.email}`, account),
    ]);

    return account;
  }

  async getAccounts(): Promise<Account[]> {
    const cachedAccounts = await this.cacheManager.get<Account[]>('accounts');
    if (cachedAccounts) {
      return cachedAccounts;
    }

    const accounts = await this.accountModel.find();
    await this.cacheManager.set('accounts', accounts);

    return accounts;
  }

  async getAccount(accountId: number): Promise<Account> | null {
    const cachedAccount = await this.cacheManager.get<Account>(
      `accounts:${accountId}`,
    );
    if (cachedAccount) {
      return cachedAccount;
    }

    const account = await this.accountModel.findOneBy({ id: accountId });
    if (!account) {
      return null;
    }
    await this.cacheManager.set(`accounts:${accountId}`, account);

    return account;
  }

  async getAccountByEmail(email: string): Promise<Account> | null {
    const cachedAccount = await this.cacheManager.get<Account>(
      `accounts:${email}`,
    );
    if (cachedAccount) {
      return cachedAccount;
    }

    const account = await this.accountModel.findOneBy({ email });
    if (!account) {
      return null;
    }
    await this.cacheManager.set(`accounts:${email}`, account);

    return account;
  }

  async updateProfile(
    accountId: number,
    profile: UpdateProfileDto,
  ): Promise<Account> | null {
    const account = await this.accountModel.findOneBy({ id: accountId });
    if (!account) {
      return null;
    }

    Object.assign(account, { profile });

    await Promise.all([
      account.save(),
      this.cacheManager.del(`accounts:${accountId}`),
    ]);

    return account;
  }

  async deleteAccount(accountId: number): Promise<void> {
    await this.accountModel.softDelete({ id: accountId });
    await this.cacheManager.del(`accounts:${accountId}`);
  }
}
