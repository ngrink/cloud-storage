import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

import { Profile } from './profile.entity';
import { Role } from './roles.entity';

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
}
