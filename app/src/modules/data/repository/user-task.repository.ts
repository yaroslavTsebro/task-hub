import { Injectable } from '@nestjs/common';
import { UserTaskStatus, UserTaskDocument } from 'src/shared/dto/entities/user-task';
import { UserTaskDao } from '../dao/user-task.dao';
import { IUserTask } from 'src/shared/contracts/entity/user-task';

@Injectable()
export class UserTaskRepository {
  constructor(private readonly userTaskDao: UserTaskDao) {}

  async assignUserToTask(userId: string, taskId: string, role: UserTaskStatus): Promise<IUserTask> {
    const ut = await this.userTaskDao.assignUserToTask(userId, taskId, role);
    return this.mapToDomain(ut);
  }

  async findByUserAndTask(userId: string, taskId: string): Promise<IUserTask | null> {
    const ut = await this.userTaskDao.findByUserAndTask(userId, taskId);
    return ut ? this.mapToDomain(ut) : null;
  }

  async findTaskUsers(taskId: string): Promise<IUserTask[]> {
    const uts = await this.userTaskDao.findTaskUsers(taskId);
    return uts.map(u => this.mapToDomain(u));
  }

  async updateRole(userTaskId: string, role: UserTaskStatus): Promise<IUserTask | null> {
    const ut = await this.userTaskDao.updateRole(userTaskId, role);
    return ut ? this.mapToDomain(ut) : null;
  }

  async remove(userTaskId: string): Promise<IUserTask | null> {
    const ut = await this.userTaskDao.remove(userTaskId);
    return ut ? this.mapToDomain(ut) : null;
  }

  private mapToDomain(doc: UserTaskDocument): IUserTask {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      taskId: doc.taskId.toString(),
      role: doc.role,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}
