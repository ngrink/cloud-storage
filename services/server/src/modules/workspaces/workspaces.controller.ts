import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  Authenticated,
  Roles,
  CurrentUser,
} from '@/shared/modules/auth/decorators/';
import { Role } from '@/shared/modules/auth/enums';
import { FoldersService } from '@/modules/folders';
import { FilesService } from '@/modules/files';

import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@ApiTags('workspaces')
@Controller('workspaces')
export class WorkspacesController {
  constructor(
    private readonly workspacesService: WorkspacesService,
    private readonly foldersService: FoldersService,
    private readonly filesService: FilesService,
  ) {}

  /*
    Create workspace
  */
  @Post()
  @Authenticated()
  create(
    @CurrentUser('id') accountId: number,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return this.workspacesService.createWorkspace(
      accountId,
      createWorkspaceDto,
    );
  }

  /*
    Get workspaces
  */
  @Get()
  @Authenticated()
  @Roles(Role.ADMIN)
  getAll() {
    return this.workspacesService.getAllWorkspaces();
  }

  /*
    Get workspace
  */
  @Get(':id')
  @Authenticated()
  @Roles(Role.ADMIN)
  get(@Param('id') workspaceId: number) {
    return this.workspacesService.getWorkspace(workspaceId);
  }

  /*
    Update workspace
  */
  @Patch(':id')
  @Authenticated()
  update(
    @Param('id') workspaceId: number,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.updateWorkspace(
      workspaceId,
      updateWorkspaceDto,
    );
  }

  /*
    Delete workspace
  */
  @Delete(':id')
  @Authenticated()
  remove(@Param('id') workspaceId: number) {
    return this.workspacesService.removeWorkspace(workspaceId);
  }

  /*
    Get workspace folders
  */
  @Get(':id/folders')
  @Authenticated()
  getWorkspaceFolders(
    @Param('id') workspaceId: number,
    @Query('parentId') parentId: number,
  ) {
    return this.foldersService.getWorkspaceFolders(workspaceId, parentId);
  }

  /*
    Get workspace files
  */
  @Get(':id/files')
  @Authenticated()
  getWorkspaceFiles(
    @Param('id') workspaceId: number,
    @Query('parentId') parentId: number,
  ) {
    return this.filesService.getWorkspaceFiles(workspaceId, parentId);
  }
}
