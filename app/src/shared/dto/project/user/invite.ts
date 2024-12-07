import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum InviteUserRole {
  WORKER='WORKER',
  ADMIN='ADMIN',
  VIEWER='VIEWER',
}

export class InviteUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(InviteUserRole)
  role: InviteUserRole
}