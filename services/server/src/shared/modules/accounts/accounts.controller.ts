import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { WorkspacesService } from '@/modules/workspaces';
import { Authenticated, Roles, User } from '@/shared/modules/auth/decorators';
import { Role } from '@/shared/modules/auth/enums';
import { AccessTokenDto } from '@/shared/modules/auth';

import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordBodyDto } from './dto/update-password.dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly workspacesService: WorkspacesService,
  ) {}

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
  @Authenticated()
  @Roles(Role.ADMIN)
  async getAccounts() {
    return await this.accountsService.getAccounts();
  }

  /*
    Get account
  */
  @Get(':id')
  @Authenticated()
  @Roles(Role.ADMIN)
  async getAccount(@Param('id') accountId: number) {
    return await this.accountsService.getAccount(accountId);
  }

  /*
    Update account profile
  */
  @Patch(':id/profile')
  @Authenticated()
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
  @Authenticated()
  async deleteAccount(@Param('id') accountId: number) {
    return await this.accountsService.deleteAccount(accountId);
  }

  /*
    Verify account email
  */
  @HttpCode(200)
  @Post('/email/verify')
  async verifyEmail(@Query('token') token: string) {
    return await this.accountsService.verifyEmail(token);
  }
  /*
    Update password
  */
  @HttpCode(200)
  @Patch('/password')
  @Authenticated()
  async updatePassword(
    @User('id') accountId: number,
    @Body() updatePasswordBodyDto: UpdatePasswordBodyDto,
  ) {
    await this.accountsService.updatePassword({
      accountId,
      ...updatePasswordBodyDto,
    });
  }

  /*
    Request password reset
  */
  @HttpCode(200)
  @Post('/password/reset')
  async requestPasswordReset(@Body('email') email: string) {
    await this.accountsService.requestResetPassword(email);
    return 'OK';
  }

  /*
    Reset password
  */
  @HttpCode(200)
  @Post('/password/reset/confirm')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.accountsService.resetPassword(resetPasswordDto);
    return 'OK';
  }

  /*
    Get account workspaces
  */
  @Get(':id/workspaces')
  @Authenticated()
  async getAccountWorkspaces(@Param('id') accountId: number) {
    return await this.workspacesService.getAccountWorkspaces(accountId);
  }
}
