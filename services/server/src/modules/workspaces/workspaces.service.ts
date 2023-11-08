import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';

import { Account } from '@/shared/modules/accounts';

import { WorkspacesException } from './workspaces.exception';
import { Workspace } from './entities/workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspacesRepository: Repository<Workspace>,
  ) {}

  async createWorkspace(
    accountId: number,
    createWorkspaceDto: CreateWorkspaceDto,
  ) {
    const workspace = this.workspacesRepository.create({
      ...createWorkspaceDto,
      accountId,
    });
    await this.workspacesRepository.save(workspace);

    return workspace;
  }

  async getAllWorkspaces() {
    const workspaces = await this.workspacesRepository.find();

    return workspaces;
  }

  async getAccountWorkspaces(accountId: number) {
    const workspaces = await this.workspacesRepository.findBy({ accountId });

    return workspaces;
  }

  async getWorkspace(workspaceId: number) {
    const workspace = await this.workspacesRepository.findOneBy({
      id: workspaceId,
    });
    if (!workspace) {
      throw WorkspacesException.WorkspaceNotFound();
    }

    return workspace;
  }

  async updateWorkspace(
    workspaceId: number,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const workspace = await this.workspacesRepository.findOneBy({
      id: workspaceId,
    });
    if (!workspace) {
      throw WorkspacesException.WorkspaceNotFound();
    }

    Object.assign(workspace, updateWorkspaceDto);
    await this.workspacesRepository.save(workspace);

    return 'OK';
  }

  async removeWorkspace(workspaceId: number) {
    const result = await this.workspacesRepository.softDelete({
      id: workspaceId,
    });
    if (!result.affected) {
      throw WorkspacesException.WorkspaceNotFound();
    }

    return 'OK';
  }

  @OnEvent('account.created')
  async handleAccountCreatedEvent(account: Account) {
    await this.createWorkspace(account.id, {
      name: '__DEFAULT__',
    });
  }
}
