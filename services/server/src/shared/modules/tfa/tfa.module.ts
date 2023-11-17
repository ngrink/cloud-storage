import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Factor } from './entities/factor.entity';
import { TfaController } from './tfa.controller';
import { TfaService } from './tfa.service';

@Module({
  imports: [TypeOrmModule.forFeature([Factor])],
  controllers: [TfaController],
  providers: [TfaService],
  exports: [TfaService],
})
export class TfaModule {}
