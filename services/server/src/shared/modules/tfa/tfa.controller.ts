import { Controller, Post, Body, Delete, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Authenticated, CurrentUser } from '@/shared/modules/auth/decorators';
import { AccessTokenDto } from '@/shared/modules/auth';
import { TfaService } from './tfa.service';

@ApiTags('auth')
@Controller('auth/2fa')
export class TfaController {
  constructor(private readonly tfaService: TfaService) {}

  /*
    Add 2fa
  */
  @Post()
  @Authenticated()
  async addFactor(@CurrentUser() account: AccessTokenDto) {
    return await this.tfaService.addFactor(account);
  }

  /*
    Get 2fa code
  */
  @Get()
  @Authenticated()
  async getCode(@CurrentUser('id') accountId: number) {
    return await this.tfaService.getCode(accountId);
  }

  /*
    Remove 2fa
  */
  @Delete()
  @Authenticated()
  async removeFactor(
    @CurrentUser('id') accountId: number,
    @Body('code') code: string,
  ) {
    await this.tfaService.removeFactor(accountId, code);
  }
}
