import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Session } from '../entities/session.entity';
import { Account } from '@/shared/modules/accounts';
import { ClientDto } from '../dto';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionModel: Repository<Session>,
  ) {}

  async createSession(
    account: Account,
    client: ClientDto,
    refreshToken?: string,
  ): Promise<Session> {
    const sessionDB = await this.getSession(account.id, client.id);
    if (sessionDB) {
      sessionDB.refreshToken = refreshToken;
      await sessionDB.save();

      return sessionDB;
    }

    const session = this.sessionModel.create({
      account: account,
      accountId: account.id,
      clientId: client.id,
      userIP: client.ip,
      userAgent: client.useragent,
      refreshToken: refreshToken,
    });
    await this.sessionModel.save(session);

    return session;
  }

  async getSessions(): Promise<Session[]> {
    const sessions = await this.sessionModel.find();

    return sessions;
  }

  async getSession(accountId: number, clientId: string): Promise<Session> {
    const session = await this.sessionModel.findOneBy({
      accountId,
      clientId,
    });
    if (!session) {
      return null;
    }

    return session;
  }

  async getSessionByRefreshToken(token: string): Promise<Session> {
    const session = await this.sessionModel.findOneBy({
      refreshToken: token,
    });
    if (!session) {
      return null;
    }

    return session;
  }

  async updateSession(
    accountId: number,
    clientId: string,
    data: Partial<Session>,
  ): Promise<Session> {
    const session = await this.getSession(accountId, clientId);
    if (!session) {
      return null;
    }

    Object.assign(session, data);
    await session.save();

    return session;
  }

  async updateSessionByRefreshToken(
    refreshToken: string,
    data: Partial<Session>,
  ): Promise<Session> {
    const session = await this.getSessionByRefreshToken(refreshToken);
    if (!session) {
      return null;
    }

    Object.assign(session, data);
    await session.save();

    return session;
  }

  async deleteSession(accountId: number, clientId: string) {
    await this.sessionModel.delete({
      accountId,
      clientId,
    });
  }
}
