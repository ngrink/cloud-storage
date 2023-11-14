import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('password_resets')
export class PasswordReset extends BaseEntity {
  @PrimaryColumn()
  token: string;

  @Column()
  accountId: number;

  @CreateDateColumn()
  createdAt: number;

  @ManyToOne(() => Account, (account) => account.password_resets)
  account: Account;
}
