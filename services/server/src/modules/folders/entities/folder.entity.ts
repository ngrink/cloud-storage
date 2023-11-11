import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Account } from '@/shared/modules/accounts';
import { Workspace } from '@/modules/workspaces';

@Entity('folders')
export class Folder {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsNumber()
  accountId: number;

  @Column()
  @IsNumber()
  workspaceId: number;

  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  parentId?: number = null;

  @Column()
  @IsString()
  name: string;

  @Column({ default: 0 })
  @IsNumber()
  size: number = 0;

  // @Column()
  // @IsString()
  // location: string;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @DeleteDateColumn()
  @IsDate()
  deletedAt: Date;

  @ManyToOne(() => Account, (account) => account.workspaces, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  account: Account;

  @ManyToOne(() => Workspace, (workspace) => workspace.folders, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  workspace: Workspace;
}
