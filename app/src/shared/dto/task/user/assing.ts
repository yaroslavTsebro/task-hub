import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { UserTaskStatus } from '../../entities/user-task';

export class AssignTaskDto {
  @ApiProperty({ type: String })
  @IsString()
  userId: string;

  @ApiProperty({ enum: UserTaskStatus })
  @IsEnum(UserTaskStatus)
  role: UserTaskStatus;
}
