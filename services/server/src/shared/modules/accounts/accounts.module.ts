import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspacesModule } from '@/modules/workspaces';

import { Account } from './entities/account.entity';
import { Profile } from './entities/profile.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './accounts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Profile]), WorkspacesModule],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository],
  exports: [AccountsService],
})
export class AccountsModule {}
