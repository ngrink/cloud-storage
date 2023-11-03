import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  /*
    Create account
  */
  @Post()
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return await this.accountsService.createAccount(createAccountDto);
  }

  /*
    Get accounts
  */
  @Get()
  async getAccounts() {
    return await this.accountsService.getAccounts();
  }

  /*
    Get account
  */
  @Get(':id')
  async getAccount(@Param('id') accountId: number) {
    return await this.accountsService.getAccount(accountId);
  }

  /*
    Update account profile
  */
  @Patch(':id/profile')
  async updateProfile(
    @Param('id') accountId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.accountsService.updateProfile(
      accountId,
      updateProfileDto,
    );
  }

  /*
    Soft delete account
  */
  @Delete(':id')
  async deleteAccount(@Param('id') accountId: number) {
    return await this.accountsService.deleteAccount(accountId);
  }
}
