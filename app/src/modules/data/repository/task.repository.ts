import { Injectable } from '@nestjs/common';
import { TaskDocument, TaskStatus } from 'src/shared/dto/entities/task';
import { CreateTaskDto } from 'src/shared/dto/task/create';
import { UpdateTaskDto } from 'src/shared/dto/task/update';
import { TaskDao } from '../dao/task.dao';
import { ITask } from 'src/shared/contracts/entity/task';

@Injectable()
export class TaskRepository {
  constructor(private readonly taskDao: TaskDao) {}

  async create(dto: CreateTaskDto): Promise<ITask> {
    const task = await this.taskDao.create(dto);
    return this.mapToDomain(task);
  }

  async findById(id: string): Promise<ITask | null> {
    const task = await this.taskDao.findById(id);
    return task ? this.mapToDomain(task) : null;
  }

  async findAllByProject(projectId: string): Promise<ITask[]> {
    const tasks = await this.taskDao.findAllByProject(projectId);
    return tasks.map(t => this.mapToDomain(t));
  }

  async update(id: string, dto: UpdateTaskDto): Promise<ITask | null> {
    const task = await this.taskDao.update(id, dto);
    return task ? this.mapToDomain(task) : null;
  }

  async delete(id: string): Promise<ITask | null> {
    const task = await this.taskDao.delete(id);
    return task ? this.mapToDomain(task) : null;
  }

  private mapToDomain(doc: TaskDocument): ITask {
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      projectId: doc.projectId.toString(),
      status: doc.status as TaskStatus,
      startDate: doc.startDate,
      endDate: doc.endDate,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}
