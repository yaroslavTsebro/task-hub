import { Injectable } from '@nestjs/common';
import { ProjectDocument } from 'src/shared/dto/entities/project';
import { ProjectDao } from '../dao/project.dao';
import { IProject } from 'src/shared/contracts/entity/project';


@Injectable()
export class ProjectRepository {
  constructor(private readonly projectDao: ProjectDao) {}

  async create(name: string, description?: string): Promise<IProject> {
    const project = await this.projectDao.create(name, description);
    return this.mapToDomain(project);
  }

  async findById(id: string): Promise<IProject | null> {
    const project = await this.projectDao.findById(id);
    return project ? this.mapToDomain(project) : null;
  }

  async findAll(): Promise<IProject[]> {
    const projects = await this.projectDao.findAll();
    return projects.map(p => this.mapToDomain(p));
  }

  async update(id: string, update: Partial<IProject>): Promise<IProject | null> {
    const project = await this.projectDao.update(id, update);
    return project ? this.mapToDomain(project) : null;
  }

  private mapToDomain(doc: ProjectDocument): IProject {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}
