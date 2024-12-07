import { IsJWT } from 'class-validator';

export class RefreshDto{
  @IsJWT()
  token: string;
}