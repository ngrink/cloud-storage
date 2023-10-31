import { ConfigModuleOptions } from '@nestjs/config';

export const ConfigOptions: ConfigModuleOptions = {
  envFilePath: `.env.${process.env.NODE_ENV}`,
  isGlobal: true,
};
