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

import { Authenticated, User } from '@/shared/modules/auth/decorators/';

import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@ApiTags('workspaces')
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  /*
    Create workspace
  */
  @Post()
  @Authenticated()
  create(
    @User('id') accountId: number,
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
  getAll() {
    return this.workspacesService.getAllWorkspaces();
  }

  /*
    Get workspace
  */
  @Get(':id')
  @Authenticated()
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
}
