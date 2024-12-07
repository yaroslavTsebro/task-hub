import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserTask, UserTaskDocument, UserTaskStatus } from 'src/shared/dto/entities/user-task';

@Injectable()
export class UserTaskDao {
  constructor(@InjectModel(UserTask.name) private userTaskModel: Model<UserTaskDocument>) {}

  async assignUserToTask(userId: string, taskId: string, role: UserTaskStatus = UserTaskStatus.PERFORMER): Promise<UserTaskDocument> {
    const userTask = new this.userTaskModel({ userId, taskId, role });
    return userTask.save();
  }

  async findByUserAndTask(userId: string, taskId: string): Promise<UserTaskDocument | null> {
    return this.userTaskModel.findOne({ userId, taskId }).exec();
  }

  async findTaskUsers(taskId: string): Promise<UserTaskDocument[]> {
    return this.userTaskModel.find({ taskId }).exec();
  }

  async updateRole(userTaskId: string, role: UserTaskStatus): Promise<UserTaskDocument | null> {
    return this.userTaskModel.findByIdAndUpdate(userTaskId, { role }, { new: true }).exec();
  }

  async remove(userTaskId: string): Promise<UserTaskDocument | null> {
    return this.userTaskModel.findByIdAndDelete(userTaskId).exec();
  }
}
