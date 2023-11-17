import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { IsNumber, IsString } from 'class-validator';

import { Account } from '@/shared/modules/accounts';

@Entity('factors')
export class Factor extends BaseEntity {
  @PrimaryColumn()
  @IsNumber()
  accountId: number;

  @Column()
  @IsString()
  secret: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Account, (account) => account.tfa, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  account: Account;
}
