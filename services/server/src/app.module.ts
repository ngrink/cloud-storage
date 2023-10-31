import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigOptions } from './config/dotenv.config';
import { TypeOrmOptions } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigOptions),
    TypeOrmModule.forRootAsync(TypeOrmOptions),
  ],
})
export class AppModule {}
