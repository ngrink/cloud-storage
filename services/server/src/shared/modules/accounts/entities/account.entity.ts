import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsStrongPassword,
} from 'class-validator';
import { Exclude } from 'class-transformer';

import { Session } from '@/shared/modules/auth';
import { Role } from '@/shared/modules/auth/enums';
import { Workspace } from '@/modules/workspaces';

import { Profile } from './profile.entity';
import { PasswordReset } from './password-reset.entity';
import { Factor } from '../../tfa';

@Entity('accounts')
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsStrongPassword({ minLength: 12 })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  @IsBoolean()
  isVerified: boolean = false;

  @Column('text', { array: true })
  @IsArray()
  roles: Role[] = [Role.USER];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Profile, (profile) => profile.account, {
    cascade: true,
    eager: true,
  })
  profile: Profile;

  @OneToMany(() => Session, (session) => session.account)
  sessions: Session[];

  @OneToMany(() => Workspace, (workspace) => workspace.account)
  workspaces: Workspace[];

  @OneToMany(() => PasswordReset, (password_reset) => password_reset.account)
  password_resets: PasswordReset[];

  @OneToOne(() => Factor, (factor) => factor.account)
  tfa: Factor;
}
