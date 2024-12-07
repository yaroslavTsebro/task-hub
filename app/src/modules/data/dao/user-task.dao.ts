import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserTask, UserTaskDocument, UserTaskStatus } from 'src/shared/dto/entities/user-task';

@Injectable()
export class UserTaskDao {
  constructor(@InjectModel(UserTask.name) private userTaskModel: Model<UserTaskDocument>) {}

  async assignUserToTask(userId: string, taskId: string, role: UserTaskStatus = UserTaskStatus.PERFORMER): Promise<UserTaskDocument> {
    const typedUserId = new Types.ObjectId(userId);
    const typedTaskId = new Types.ObjectId(taskId);
    const userTask = new this.userTaskModel({ userId: typedUserId, taskId: typedTaskId, role });
    return userTask.save();
  }

  async findByUserAndTask(userId: string, taskId: string): Promise<UserTaskDocument | null> {
    const typedUserId = new Types.ObjectId(userId);
    const typedTaskId = new Types.ObjectId(taskId);
    return this.userTaskModel.findOne({ userId: typedUserId, taskId: typedTaskId }).exec();
  }

  async findTaskUsers(taskId: string): Promise<UserTaskDocument[]> {
    const typedTaskId = new Types.ObjectId(taskId);
    return this.userTaskModel.find({ taskId: typedTaskId }).exec();
  }

  async updateRole(userTaskId: string, role: UserTaskStatus): Promise<UserTaskDocument | null> {
    const typedUserTaskId = new Types.ObjectId(userTaskId);
    return this.userTaskModel.findByIdAndUpdate(typedUserTaskId , { role }, { new: true }).exec();
  }

  async remove(userTaskId: string): Promise<UserTaskDocument | null> {
    const typedUserTaskId = new Types.ObjectId(userTaskId);
    return this.userTaskModel.findByIdAndDelete(typedUserTaskId).exec();
  }
}
