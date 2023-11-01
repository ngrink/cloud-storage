import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { ConfigOptions } from './config/dotenv.config';
import { TypeOrmOptions } from './config/typeorm.config';
import { CacheOptions } from './config/cache.config';
import { AccountsModule } from './modules/accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigOptions),
    TypeOrmModule.forRootAsync(TypeOrmOptions),
    CacheModule.registerAsync(CacheOptions),
    AccountsModule,
  ],
})
export class AppModule {}
