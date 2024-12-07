import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from 'src/shared/dto/entities/task';
import { CreateTaskDto } from 'src/shared/dto/task/create';
import { UpdateTaskDto } from 'src/shared/dto/task/update';

@Injectable()
export class TaskDao {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

  async create(dto: CreateTaskDto): Promise<TaskDocument> {
    const task = new this.taskModel(dto);
    return task.save();
  }

  async findById(id: string): Promise<TaskDocument | null> {
    const objectId = new Types.ObjectId(id);
    return this.taskModel.findById(objectId).exec();
  }

  async findAllByProject(projectId: string): Promise<TaskDocument[]> {
    const projectObjectId = new Types.ObjectId(projectId);
    return this.taskModel.find({ projectId: projectObjectId }).exec();
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskDocument | null> {
    const objectId = new Types.ObjectId(id);

    return this.taskModel.findByIdAndUpdate(objectId, dto, { new: true }).exec();
  }

  async delete(id: string): Promise<TaskDocument | null> {
    const objectId = new Types.ObjectId(id);
    return this.taskModel.findByIdAndDelete(objectId).exec();
  }
}
