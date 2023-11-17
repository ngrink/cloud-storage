import { Controller, Post, Body, Delete, Get } from '@nestjs/common';

import { Authenticated, User } from '@/shared/modules/auth/decorators';
import { AccessTokenDto } from '@/shared/modules/auth';
import { TfaService } from './tfa.service';

@Controller('auth/2fa')
export class TfaController {
  constructor(private readonly tfaService: TfaService) {}

  @Post()
  @Authenticated()
  async addFactor(@User() account: AccessTokenDto) {
    return await this.tfaService.addFactor(account);
  }

  @Get()
  @Authenticated()
  async getCode(@User('id') accountId: number) {
    return await this.tfaService.getCode(accountId);
  }

  @Delete()
  @Authenticated()
  async removeFactor(
    @User('id') accountId: number,
    @Body('code') code: string,
  ) {
    await this.tfaService.removeFactor(accountId, code);
  }
}
