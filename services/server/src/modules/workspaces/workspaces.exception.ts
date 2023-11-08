import { NotFoundException } from '@nestjs/common';

export class WorkspacesException {
  static WorkspaceNotFound() {
    return new NotFoundException('Workspace not found');
  }
}
