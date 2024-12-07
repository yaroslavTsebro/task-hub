import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum InviteUserRole {
  WORKER='WORKER',
  ADMIN='ADMIN',
  VIEWER='VIEWER',
}

export class InviteUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'ADMIN', enum: InviteUserRole, description: 'Role to assign to the invited user' })
  @IsEnum(InviteUserRole)
  role: InviteUserRole;
}