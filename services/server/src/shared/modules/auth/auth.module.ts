import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsModule } from '@/shared/modules/accounts';
import { TfaModule } from '@/shared/modules/tfa';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Session } from './entities';
import { SessionsRepository } from './repositories';
import {
  GithubStrategy,
  GoogleStrategy,
  SteamStrategy,
  VKStrategy,
  YandexStrategy,
} from './strategies';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    forwardRef(() => AccountsModule),
    TfaModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionsRepository,
    GoogleStrategy,
    YandexStrategy,
    VKStrategy,
    GithubStrategy,
    SteamStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
