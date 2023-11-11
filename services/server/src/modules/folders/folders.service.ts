import { Injectable } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { IsNull, Repository } from 'typeorm';
import { Folder } from './entities/folder.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FoldersException } from './folders.exception';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder)
    private readonly foldersRepository: Repository<Folder>,
  ) {}

  async createFolder(createFolderDto: CreateFolderDto) {
    const folder = this.foldersRepository.create(createFolderDto);
    await this.foldersRepository.save(folder);

    return folder;
  }

  async getAllFolders() {
    const folders = await this.foldersRepository.find();

    return folders;
  }

  async getWorkspaceFolders(workspaceId: number, parentId: number) {
    const folders = await this.foldersRepository.findBy({
      workspaceId,
      parentId: parentId ? parentId : IsNull(),
    });

    return folders;
  }

  async getFolder(folderId: number) {
    const folder = await this.foldersRepository.findOneBy({ id: folderId });
    if (!folder) {
      throw FoldersException.FolderNotFound();
    }

    return folder;
  }

  async renameFolder(folderId: number, name: string) {
    const folder = await this.foldersRepository.findOneBy({ id: folderId });
    if (!folder) {
      throw FoldersException.FolderNotFound();
    }
    folder.name = name;
    await this.foldersRepository.save(folder);

    return 'OK';
  }

  async moveFolder(folderId: number, destinationId: number) {
    const folder = await this.foldersRepository.findOneBy({ id: folderId });
    if (!folder) {
      throw FoldersException.FolderNotFound();
    }

    folder.parentId = destinationId;
    await this.foldersRepository.save(folder);

    return 'OK';
  }

  async removeFolder(folderId: number) {
    await this.foldersRepository.softDelete({ id: folderId });

    return 'OK';
  }
}
