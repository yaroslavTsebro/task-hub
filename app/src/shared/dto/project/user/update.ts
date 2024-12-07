import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { InviteUserRole } from './invite';

export class UpdateUserProjectDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(InviteUserRole)
  role: InviteUserRole
}