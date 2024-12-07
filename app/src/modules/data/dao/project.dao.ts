import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from 'src/shared/dto/entities/project';

@Injectable()
export class ProjectDao {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  async create(name: string, description?: string): Promise<ProjectDocument> {
    const project = new this.projectModel({ name, description });
    return project.save();
  }

  async findById(id: string): Promise<ProjectDocument | null> {
    const objectId = new Types.ObjectId(id);
    return this.projectModel.findById(objectId).exec();
  }

  async update(id: string, update: Partial<Project>): Promise<ProjectDocument | null> {
    const objectId = new Types.ObjectId(id);
    return this.projectModel.findByIdAndUpdate(objectId, update, { new: true }).exec();
  }

  async findAll(): Promise<ProjectDocument[]> {
    return this.projectModel.find().exec();
  }
}
