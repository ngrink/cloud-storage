import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsModule } from '@/shared/modules/accounts';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Session } from './entities/session.entity';
import { SessionsRepository } from './repositories/session.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), AccountsModule],
  controllers: [AuthController],
  providers: [AuthService, SessionsRepository],
})
export class AuthModule {}
