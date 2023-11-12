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
import { ServeStaticModule } from '@nestjs/serve-static';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { ConfigOptions } from './config/dotenv.config';
import { TypeOrmOptions } from './config/typeorm.config';
import { CacheOptions } from './config/cache.config';
import { MulterOptions } from './config/multer.config';
import { ServeStaticOptions } from './config/serve-static.config';
import { EventEmitterOptions } from './config/event-emitter.config';

import { TokensModule } from '@/shared/modules/tokens';
import { AccountsModule } from '@/shared/modules/accounts';
import { AuthModule, AuthGuard, RolesGuard } from '@/shared/modules/auth';
import { StorageModule } from '@/shared/modules/storage';
import { MailModule } from '@/shared/modules/mail';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { FoldersModule } from '@/modules/folders';
import { FilesModule } from '@/modules/files';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(ConfigOptions),
    TypeOrmModule.forRootAsync(TypeOrmOptions),
    CacheModule.registerAsync(CacheOptions),
    MulterModule.registerAsync(MulterOptions),
    ServeStaticModule.forRootAsync(ServeStaticOptions),
    EventEmitterModule.forRoot(EventEmitterOptions),
    TokensModule,
    AccountsModule,
    AuthModule,
    StorageModule,
    MailModule,
    WorkspacesModule,
    FoldersModule,
    FilesModule,
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
