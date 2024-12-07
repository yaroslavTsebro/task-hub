import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from 'src/shared/dto/entities/project';

@Injectable()
export class ProjectDao {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  async create(name: string, description?: string): Promise<ProjectDocument> {
    const project = new this.projectModel({ name, description });
    return project.save();
  }

  async findById(id: string): Promise<ProjectDocument | null> {
    return this.projectModel.findById(id).exec();
  }

  async update(id: string, update: Partial<Project>): Promise<ProjectDocument | null> {
    return this.projectModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async findAll(): Promise<ProjectDocument[]> {
    return this.projectModel.find().exec();
  }
}
