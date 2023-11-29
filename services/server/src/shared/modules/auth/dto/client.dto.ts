import { IsIP, IsString } from 'class-validator';

export class ClientDto {
  @IsString()
  id: string;

  @IsIP()
  ip: string;

  @IsString()
  useragent: string;
}
