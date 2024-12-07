import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { IUser } from 'src/shared/contracts/entity/user';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ProjectRoles } from 'src/shared/decorators/project-roles.decorator';
import { UserProjectRole } from 'src/shared/dto/entities/user-project';
import { ChangeStatusDto } from 'src/shared/dto/task/change-status';
import { CreateTaskDto } from 'src/shared/dto/task/create';
import { UpdateTaskDto } from 'src/shared/dto/task/update';
import { AssignTaskDto } from 'src/shared/dto/task/user/assing';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { ProjectGuard } from '../auth/guards/project.guard';
import { GetTasksDto } from 'src/shared/dto/task/get';

@ApiTags('tasks')
@Controller('task')
@UseGuards(AuthorizationGuard, ProjectGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ProjectRoles()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: IUser,
  ) {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Post(':id/assign-user')
  @ApiOperation({ summary: 'Assign a user to a task' })
  @ProjectRoles(UserProjectRole.OWNER, UserProjectRole.ADMIN)
  async assignTaskToUser(
    @Param('id') taskId: string,
    @Body() assignTaskDto: AssignTaskDto,
    @CurrentUser() user: IUser,
  ) {
    return this.taskService.assignTaskToUser(taskId, assignTaskDto, user);
  }

  @Post(':id/assign-yourself')
  @ApiOperation({ summary: 'Assign yourself to a task' })
  @ProjectRoles()
  async assignYourselfToTask(
    @Param('id') taskId: string,
    @CurrentUser() user: IUser,
  ) {
    return this.taskService.assignYourselfToTask(taskId, user);
  }

  @Patch(':id/change-status')
  @ApiOperation({ summary: 'Change the status of a task' })
  @ProjectRoles()
  async changeTaskStatus(
    @Param('id') taskId: string,
    @Body() changeStatusDto: ChangeStatusDto,
    @CurrentUser() user: IUser,
  ) {
    return this.taskService.changeTaskStatus(taskId, changeStatusDto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ProjectRoles()
  async updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: IUser,
  ) {
    return this.taskService.updateTask(taskId, updateTaskDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ProjectRoles()
  async getAllTasks(
    @Query() getTasksDto: GetTasksDto,
    @CurrentUser() user: IUser,
  ) {
    return this.taskService.getAllTasks(getTasksDto, user);
  }

  @Get('my-tasks')
  @ApiOperation({ summary: 'Get all tasks you are involved in' })
  @ProjectRoles()
  async getUserTasks(
    @Query() getTasksDto: GetTasksDto,
    @CurrentUser() user: IUser,
  ) {
    return this.taskService.getUserTasks(getTasksDto, user);
  }
}
