import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @ApiProperty({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @ApiProperty()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @ApiProperty()
  @IsDateString()
  endDate?: Date;
}