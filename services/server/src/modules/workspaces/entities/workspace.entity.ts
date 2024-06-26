import { IsDate, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Account } from '@/shared/modules/accounts';
import { Folder } from '@/modules/folders';
import { File } from '@/modules/files';

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsNumber()
  accountId: number;

  @Column()
  @IsString()
  name: string;

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

  @OneToMany(() => Folder, (folder) => folder.workspace)
  folders: Folder[];

  @OneToMany(() => File, (file) => file.workspace)
  files: File[];
}
