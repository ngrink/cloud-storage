import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsStrongPassword,
} from 'class-validator';

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
  password: string;

  @Column({ name: 'is_verified' })
  @IsBoolean()
  isVerified: boolean = false;

  @Column('text', { array: true })
  @IsArray()
  roles: Role[] = [Role.USER];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => Profile, (profile) => profile.account, {
    cascade: true,
    eager: true,
  })
  profile: Profile;
}
