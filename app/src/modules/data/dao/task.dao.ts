import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from 'src/shared/dto/entities/task';
import { CreateTaskDto } from 'src/shared/dto/task/create';
import { UpdateTaskDto } from 'src/shared/dto/task/update';

@Injectable()
export class TaskDao {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(dto: CreateTaskDto): Promise<TaskDocument> {
    const task = new this.taskModel(dto);
    return task.save();
  }

  async findById(id: string): Promise<TaskDocument | null> {
    return this.taskModel.findById(id).exec();
  }

  async findAllByProject(projectId: string): Promise<TaskDocument[]> {
    return this.taskModel.find({ projectId }).exec();
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskDocument | null> {
    return this.taskModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string): Promise<TaskDocument | null> {
    return this.taskModel.findByIdAndDelete(id).exec();
  }
}
