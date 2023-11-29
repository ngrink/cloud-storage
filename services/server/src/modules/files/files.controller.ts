import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Get,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import {
  Authenticated,
  Roles,
  CurrentUser,
} from '@/shared/modules/auth/decorators';
import { Role } from '@/shared/modules/auth/enums';

import { FilesService } from './files.service';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /* 
    Upload files
  */
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @Post()
  @Authenticated()
  uploadFiles(
    @CurrentUser('id') accountId: number,
    @Body('workspaceId') workspaceId: number,
    @Body('parentId') parentId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.filesService.uploadFiles(
      accountId,
      workspaceId,
      parentId,
      files,
    );
  }

  /*
    Get files
  */
  @Get()
  @Authenticated()
  @Roles(Role.ADMIN)
  getAllFiles() {
    return this.filesService.getAllFiles();
  }

  /*
    Get file
  */
  @Get(':id')
  @Authenticated()
  @Roles(Role.ADMIN)
  getFile(@Param('id') fileId: string) {
    return this.filesService.getFile(fileId);
  }

  /*
    Rename file
  */
  @Patch(':id/rename')
  @Authenticated()
  renameFile(@Param('id') fileId: string, @Body('name') name: string) {
    return this.filesService.renameFile(fileId, name);
  }

  /*
    Move file
  */
  @Patch('move')
  @Authenticated()
  moveFiles(
    @Body('ids') fileIds: number[],
    @Body('destinationId') destinationId: number,
  ) {
    return this.filesService.moveFiles(fileIds, destinationId);
  }

  /*
    Delete files
  */
  @Delete()
  @Authenticated()
  deleteFiles(@Body('ids') fileIds: number[]) {
    return this.filesService.deleteFiles(fileIds);
  }
}
