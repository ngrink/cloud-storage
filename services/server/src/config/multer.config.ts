import * as path from 'path';
import * as multer from 'multer';
import * as uuid from 'uuid';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModuleAsyncOptions } from '@nestjs/platform-express';

export const MulterOptions: MulterModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    storage: multer.diskStorage({
      destination: (req: any, file: any, cb: any) => {
        const storagePath = configService.get('STORAGE_PATH');
        cb(null, storagePath);
      },
      filename: (req: any, file: any, cb: any) => {
        cb(null, `${uuid.v4()}${path.extname(file.originalname)}`);
      },
    }),
  }),
};
