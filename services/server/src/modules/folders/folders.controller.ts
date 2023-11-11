import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Authenticated, Roles, User } from '@/shared/modules/auth/decorators';
import { Role } from '@/shared/modules/auth/enums';
import { AccessTokenDto } from '@/shared/modules/auth';

import { FoldersService } from './folders.service';
import { CreateFolderBodyDto } from './dto/create-folder.dto';

@ApiTags('folders')
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  /*
    Create folder
  */
  @Post()
  @Authenticated()
  create(
    @User() account: AccessTokenDto,
    @Body() createFolderBodyDto: CreateFolderBodyDto,
  ) {
    return this.foldersService.createFolder({
      ...createFolderBodyDto,
      accountId: account.id,
    });
  }

  /*
    Get folders
  */
  @Get()
  @Authenticated()
  @Roles(Role.ADMIN)
  getAll() {
    return this.foldersService.getAllFolders();
  }

  /*
    Get folder
  */
  @Get(':id')
  @Authenticated()
  @Roles(Role.ADMIN)
  get(@Param('id') folderId: number) {
    return this.foldersService.getFolder(folderId);
  }

  /*
    Rename folder
  */
  @Patch(':id/rename')
  @Authenticated()
  rename(@Param('id') folderId: number, @Body('name') name: string) {
    return this.foldersService.renameFolder(folderId, name);
  }

  /*
    Move folder
  */
  @Patch(':id/move')
  @Authenticated()
  move(
    @Param('id') folderId: number,
    @Body('destinationId') destinationId: number,
  ) {
    return this.foldersService.moveFolder(folderId, destinationId);
  }

  /*
    Remove folder
  */
  @Delete(':id')
  @Authenticated()
  remove(@Param('id') folderId: number) {
    return this.foldersService.removeFolder(folderId);
  }
}
