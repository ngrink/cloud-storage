import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFolderBodyDto {
  @IsNumber()
  workspaceId: number;

  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  parentId?: number = null;
}

export class CreateFolderDto extends CreateFolderBodyDto {
  @IsString()
  accountId: number;
}
