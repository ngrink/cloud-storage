import { NotFoundException } from '@nestjs/common';

export class FilesException {
  static FileNotFound() {
    return new NotFoundException('File not found');
  }
}
