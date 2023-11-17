import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsModule } from '@/shared/modules/accounts';
import { TfaModule } from '@/shared/modules/tfa';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Session } from './entities';
import { SessionsRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), AccountsModule, TfaModule],
  controllers: [AuthController],
  providers: [AuthService, SessionsRepository],
})
export class AuthModule {}
