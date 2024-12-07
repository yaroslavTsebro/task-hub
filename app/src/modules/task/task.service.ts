
import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { IUser } from 'src/shared/contracts/entity/user';
import { UserTaskStatus } from 'src/shared/dto/entities/user-task';
import { ChangeStatusDto } from 'src/shared/dto/task/change-status';
import { CreateTaskDto } from 'src/shared/dto/task/create';
import { UpdateTaskDto } from 'src/shared/dto/task/update';
import { AssignTaskDto } from 'src/shared/dto/task/user/assing';
import { ProjectRepository } from '../data/repository/project.repository';
import { TaskRepository } from '../data/repository/task.repository';
import { UserTaskRepository } from '../data/repository/user-task.repository';
import { GetTasksDto } from 'src/shared/dto/task/get';


@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepo: TaskRepository,
    private readonly userTaskRepo: UserTaskRepository,
    private readonly projectRepo: ProjectRepository,
  ) { }

  async createTask(createTaskDto: CreateTaskDto, user: IUser) {
    const project = await this.projectRepo.findById(createTaskDto.projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const task = await this.taskRepo.create(createTaskDto);

    await this.userTaskRepo.assignUserToTask(user.id, task.id, UserTaskStatus.PERFORMER);
    return task;
  }

  async assignTaskToUser(taskId: string, assignTaskDto: AssignTaskDto, user: IUser) {
    const task = await this.taskRepo.findById(taskId);
    if (!task) { throw new NotFoundException('Task not found'); }

    const existingUserTask = await this.userTaskRepo.findByUserAndTask(assignTaskDto.userId, taskId);
    if (existingUserTask) { throw new ConflictException('User is already assigned to this task'); }

    return this.userTaskRepo.assignUserToTask(assignTaskDto.userId, taskId, assignTaskDto.role);
  }

  async assignYourselfToTask(taskId: string, user: IUser) {
    const task = await this.taskRepo.findById(taskId);
    if (!task) { throw new NotFoundException('Task not found'); }

    const existingUserTask = await this.userTaskRepo.findByUserAndTask(user.id, taskId);
    if (existingUserTask) { throw new ConflictException('User is already assigned to this task'); }

    return this.userTaskRepo.assignUserToTask(user.id, taskId, UserTaskStatus.PERFORMER);
  }

  async changeTaskStatus(taskId: string, changeStatusDto: ChangeStatusDto, user: IUser) {
    const task = await this.taskRepo.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.taskRepo.changeStatus(taskId, changeStatusDto.status);
  }

  async updateTask(taskId: string, updateTaskDto: UpdateTaskDto, user: IUser) {
    const task = await this.taskRepo.findById(taskId);
    if (!task) { throw new NotFoundException('Task not found'); }

    const userTask = await this.userTaskRepo.findByUserAndTask(user.id, taskId);

    return this.taskRepo.update(taskId, updateTaskDto);
  }

  async getAllTasks(getTasksDto: GetTasksDto, user: IUser) {
    const { page = '1', limit = '10', sort, status } = getTasksDto;
    const pagination = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const filters: any = {};
    if (status) {
      filters.status = status;
    }

    let sortOptions: any = {};
    if (sort && Array.isArray(sort)) {
      sort.forEach((s) => {
        sortOptions[s.field] = s.order === 'asc' ? 1 : -1;
      });
    } else {
      sortOptions = { createdAt: -1 };
    }

    return this.taskRepo.findAll(pagination, filters, sortOptions);
  }

  async getUserTasks(getTasksDto: GetTasksDto, user: IUser) {
    const { page = '1', limit = '10', sort, status } = getTasksDto;
    const pagination = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const filters: any = {};
    if (status) {
      filters.status = status;
    }

    let sortOptions: any = {};
    if (sort && Array.isArray(sort)) {
      sort.forEach((s) => {
        sortOptions[s.field] = s.order === 'asc' ? 1 : -1;
      });
    } else {
      sortOptions = { createdAt: -1 };
    }

    const userTasks = await this.userTaskRepo.findByUser(user.id);
    const taskIds = userTasks.map((ut) => ut.taskId);

    if (taskIds.length === 0) {
      return {
        data: [],
        total: 0,
        page: pagination.page,
        limit: pagination.limit,
      };
    }

    filters._id = { $in: taskIds };

    return this.taskRepo.findAll(pagination, filters, sortOptions);
  }
}
