import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsIP, IsJWT, IsNumber, IsString } from 'class-validator';
import { Account } from '@/shared/modules/accounts';

@Entity('sessions')
export class Session extends BaseEntity {
  @PrimaryColumn()
  @IsNumber()
  accountId: number;

  @PrimaryColumn()
  @IsString()
  clientId: string;

  @Column()
  @IsIP()
  userIP: string;

  @Column()
  @IsString()
  userAgent: string;

  @Column({ unique: true })
  @IsJWT()
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.sessions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  account: Account;
}
