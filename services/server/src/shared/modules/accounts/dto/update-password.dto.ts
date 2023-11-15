import { IsNumber, IsStrongPassword } from 'class-validator';

export class UpdatePasswordBodyDto {
  @IsStrongPassword()
  currentPassword: string;

  @IsStrongPassword()
  newPassword: string;
}

export class UpdatePasswordDto extends UpdatePasswordBodyDto {
  @IsNumber()
  accountId: number;
}
