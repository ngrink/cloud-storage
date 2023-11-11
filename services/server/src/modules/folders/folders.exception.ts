import { NotFoundException } from '@nestjs/common';

export class FoldersException {
  static FolderNotFound() {
    return new NotFoundException('Folder not found');
  }
}
