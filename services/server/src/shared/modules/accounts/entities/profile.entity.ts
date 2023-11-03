import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { IsNumber, IsString, IsUrl } from 'class-validator';

import { Account } from './account.entity';

@Entity('profiles')
export class Profile extends BaseEntity {
  @PrimaryColumn()
  @IsNumber()
  accountId: number;

  @Column()
  @IsString()
  fullname: string;

  @Column({ nullable: true })
  @IsUrl()
  avatar?: string = null;

  @OneToOne(() => Account, (account) => account.profile, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  account: Account;
}
