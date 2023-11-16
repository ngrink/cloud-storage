import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('email_updates')
export class EmailUpdate extends BaseEntity {
  @PrimaryColumn()
  token: string;

  @Column()
  accountId: number;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: number;

  @ManyToOne(() => Account, (account) => account.password_resets)
  account: Account;
}
