import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { ConfigOptions } from './config/dotenv.config';
import { TypeOrmOptions } from './config/typeorm.config';
import { CacheOptions } from './config/cache.config';

import { AccountsModule } from '@/modules/accounts';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigOptions),
    TypeOrmModule.forRootAsync(TypeOrmOptions),
    CacheModule.registerAsync(CacheOptions),
    AccountsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
