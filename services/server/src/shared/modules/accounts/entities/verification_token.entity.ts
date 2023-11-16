import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

@Entity('verification_tokens')
export class VerificationToken extends BaseEntity {
  @PrimaryColumn()
  @IsNumber()
  accountId: number;

  @Column()
  @IsString()
  token: string;

  @Column('timestamp without time zone', { nullable: true })
  @IsDate()
  @IsOptional()
  verifiedAt?: Date | null = null;
}
