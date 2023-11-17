import { randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import totp from 'totp-generator';
import urlcat from 'urlcat';
import * as base32 from 'hi-base32';
import * as qrcode from 'qrcode';

import { AccessTokenDto } from '@/shared/modules/auth';

import { TfaException } from './tfa.exception';
import { Factor } from './entities/factor.entity';

@Injectable()
export class TfaService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Factor)
    private readonly factorsRepository: Repository<Factor>,
  ) {}

  async addFactor(account: AccessTokenDto) {
    const factorDB = await this.factorsRepository.findOneBy({
      accountId: account.id,
    });
    if (factorDB) {
      throw TfaException.FactorExists();
    }

    const issuer = this.configService.get('SERVICE_NAME');
    const user = account.email;
    const random = randomBytes(32).toString('ascii');
    const secret = base32.encode(random, true);

    const keyuri = urlcat(`otpauth://totp/${issuer}%3A${user}`, {
      secret,
      issuer,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    }).replace(/ /g, '%20');
    const dataurl = await qrcode.toDataURL(keyuri);

    const factor = this.factorsRepository.create({
      accountId: account.id,
      secret,
    });
    await this.factorsRepository.save(factor);

    return { qrcode: dataurl };
  }

  async getFactor(accountId: number) {
    const factor = await this.factorsRepository.findOneBy({ accountId });

    return factor;
  }

  async getCode(accountId: number) {
    const factor = await this.factorsRepository.findOneBy({ accountId });
    const code = totp(factor.secret);

    return code;
  }

  async verifyFactor(factor: Factor, code: string) {
    if (!code) {
      throw TfaException.RequiredCode();
    }

    const timestamp = Date.now();
    const serverCodes = [-2, -1, 0].map((v) => {
      return totp(factor.secret, { timestamp: timestamp + 30000 * v });
    });

    if (!serverCodes.includes(code)) {
      throw TfaException.InvalidCode();
    }

    return true;
  }

  async verifyFactorByAccountId(accountId: number, code: string) {
    const factor = await this.factorsRepository.findOneBy({
      accountId,
    });
    if (!factor) {
      throw TfaException.FactorNotFound();
    }

    await this.verifyFactor(factor, code);

    return true;
  }

  async removeFactor(accountId: number, code: string) {
    await this.verifyFactorByAccountId(accountId, code);
    await this.factorsRepository.softDelete({ accountId });
  }
}
