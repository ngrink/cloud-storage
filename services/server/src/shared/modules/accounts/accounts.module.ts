import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/shared/modules/auth';
import { WorkspacesModule } from '@/modules/workspaces';

import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './accounts.repository';
import { Account } from './entities/account.entity';
import { Profile } from './entities/profile.entity';
import { VerificationToken } from './entities/verification_token.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { EmailUpdate } from './entities/email-update.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Profile,
      VerificationToken,
      PasswordReset,
      EmailUpdate,
    ]),
    forwardRef(() => AuthModule),
    WorkspacesModule,
  ],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository],
  exports: [AccountsService],
})
export class AccountsModule {}
