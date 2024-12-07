import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class RefreshDto{
  @IsJWT()
  @ApiProperty()
  token: string;
}