import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { StorageService } from '@/shared/modules/storage';
import { File } from './entities/file.entity';
import { FilesException } from './files.exception';

@Injectable()
export class FilesService {
  constructor(
    private readonly storageService: StorageService,
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {}

  async uploadFiles(
    accountId: number,
    workspaceId: number,
    parentId: number,
    files: Array<Express.Multer.File>,
  ) {
    const files_ = await this.storageService.save(files);
    const metadata = await this.filesRepository
      .createQueryBuilder()
      .insert()
      .values(
        files_.map((file) => ({
          id: file.filename.split('.')[0],
          accountId,
          workspaceId,
          parentId,
          name: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        })),
      )
      .returning('*')
      .execute();

    return metadata.raw;
  }

  async getAllFiles() {
    const files = await this.filesRepository.find();

    return files;
  }

  async getWorkspaceFiles(workspaceId: number, parentId: number) {
    const files = await this.filesRepository.findBy({
      workspaceId,
      parentId: parentId ? parentId : IsNull(),
    });

    return files;
  }

  async getFile(fileId: string) {
    const file = await this.filesRepository.findOneBy({ id: fileId });
    if (!file) {
      throw FilesException.FileNotFound();
    }

    return file;
  }

  async renameFile(fileId: string, name: string) {
    const file = await this.filesRepository.findOneBy({ id: fileId });
    if (!file) {
      throw FilesException.FileNotFound();
    }

    file.originalName = name;
    await this.filesRepository.save(file);

    return file;
  }

  async moveFiles(fileIds: number[], destinationId: number) {
    await this.filesRepository
      .createQueryBuilder()
      .update()
      .set({ parentId: destinationId })
      .where('file.id IN (:...fileIds)', { fileIds })
      .execute();

    return 'OK';
  }

  async deleteFiles(fileIds: number[]) {
    await this.filesRepository
      .createQueryBuilder()
      .softDelete()
      .where('file.id IN (:...fileIds)', { fileIds })
      .execute();

    return 'OK';
  }

  async restoreFiles(fileIds: number[]) {
    await this.filesRepository
      .createQueryBuilder()
      .restore()
      .where('file.id IN (:...fileIds)', { fileIds })
      .execute();

    return 'OK';
  }
}
