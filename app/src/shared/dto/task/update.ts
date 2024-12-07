import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export class UpdateTaskDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: TaskStatus.DONE, enum: TaskStatus})
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}