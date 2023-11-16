import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { Session } from '@/shared/modules/auth';
import {
  Account,
  Profile,
  VerificationToken,
  PasswordReset,
  EmailUpdate,
} from '@/shared/modules/accounts';
import { Workspace } from '@/modules/workspaces';
import { Folder } from '@/modules/folders';
import { File } from '@/modules/files';

export const TypeOrmOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USERNAME'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DATABASE'),
    synchronize: configService.get('NODE_ENV') === 'development',
    logging: false,
    entities: [
      Account,
      Profile,
      VerificationToken,
      PasswordReset,
      EmailUpdate,
      Session,
      Workspace,
      Folder,
      File,
    ],
    subscribers: [],
    migrations: [],
  }),
};
