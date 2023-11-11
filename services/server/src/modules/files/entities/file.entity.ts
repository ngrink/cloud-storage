import { Workspace } from '@/modules/workspaces';
import { Account } from '@/shared/modules/accounts';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('files')
export class File {
  @PrimaryColumn()
  @IsUUID()
  id: string;

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

  @Column({ unique: true })
  @IsString()
  name: string; // original name of the file

  @Column()
  @IsString()
  originalName: string;

  @Column()
  @IsString()
  mimetype: string;

  @Column()
  @IsNumber()
  size: number;

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

  @ManyToOne(() => Workspace, (workspace) => workspace.files, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  workspace: Workspace;
}
