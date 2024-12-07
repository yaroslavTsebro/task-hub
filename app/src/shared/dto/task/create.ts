import { TaskStatus } from '../entities/task';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;
  
  @IsString()
  projectId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}