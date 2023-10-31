import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConfigOptions } from './config/dotenv.config';

@Module({
  imports: [ConfigModule.forRoot(ConfigOptions)],
})
export class AppModule {}
