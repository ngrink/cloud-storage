import * as path from 'path';
import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private storagePath: string;

  constructor(private readonly configService: ConfigService) {
    this.storagePath = configService.get('STORAGE_PATH');

    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  async save(files: Array<Express.Multer.File>) {
    return files;
  }

  async remove(filenames: string[]) {
    await Promise.all(
      filenames.map((filename) => {
        fs.rm(this.getFilepath(filename), (err) => {
          if (err && err.code === 'ENOENT') {
            this.logger.warn(err);
          } else if (err) {
            this.logger.error(err);
          }
        });
      }),
    );
  }

  private getFilepath(filename: string) {
    return path.join(this.storagePath, filename);
  }
}
