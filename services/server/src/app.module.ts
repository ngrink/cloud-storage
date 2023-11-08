import {
  ClassSerializerInterceptor,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { MulterModule } from '@nestjs/platform-express';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { ConfigOptions } from './config/dotenv.config';
import { TypeOrmOptions } from './config/typeorm.config';
import { CacheOptions } from './config/cache.config';
import { MulterOptions } from './config/multer.config';
import { EventEmitterOptions } from './config/event-emitter.config';

import { TokensModule } from '@/shared/modules/tokens';
import { AccountsModule } from '@/shared/modules/accounts';
import { AuthModule, AuthGuard, RolesGuard } from '@/shared/modules/auth';
import { StorageModule } from '@/shared/modules/storage';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(ConfigOptions),
    TypeOrmModule.forRootAsync(TypeOrmOptions),
    CacheModule.registerAsync(CacheOptions),
    MulterModule.registerAsync(MulterOptions),
    EventEmitterModule.forRoot(EventEmitterOptions),
    TokensModule,
    AccountsModule,
    AuthModule,
    StorageModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [MulterModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
