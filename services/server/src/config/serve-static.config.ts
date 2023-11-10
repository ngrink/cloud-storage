import { ServeStaticModuleAsyncOptions } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const ServeStaticOptions: ServeStaticModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => [
    {
      rootPath: configService.get('STORAGE_PATH'),
      serveRoot: configService.get('STORAGE_PREFIX'),
    },
  ],
};
