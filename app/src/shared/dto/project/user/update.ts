import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { InviteUserRole } from './invite';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'WORKER', enum: InviteUserRole, description: 'User role in the project' })
  @IsEnum(InviteUserRole)
  role: InviteUserRole;
}