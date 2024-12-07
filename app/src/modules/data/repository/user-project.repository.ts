import { Injectable } from '@nestjs/common';
import { UserProjectRole, UserProjectDocument } from 'src/shared/dto/entities/user-project';
import { UserProjectDao } from '../dao/user-project.dao';
import { IUserProject } from 'src/shared/contracts/entity/user-project';

@Injectable()
export class UserProjectRepository {
  constructor(private readonly userProjectDao: UserProjectDao) {}

  async addUserToProject(userId: string, projectId: string, role: UserProjectRole): Promise<IUserProject> {
    const up = await this.userProjectDao.addUserToProject(userId, projectId, role);
    return this.mapToDomain(up);
  }

  async findProjectsByUser(userId: string): Promise<IUserProject[]> {
    const userProjectDocs = await this.userProjectDao.findByUser(userId);
    return userProjectDocs.map((doc) => this.mapToDomain(doc));
  }

  async findByUserAndProject(userId: string, projectId: string): Promise<IUserProject | null> {
    const up = await this.userProjectDao.findByUserAndProject(userId, projectId);
    return up ? this.mapToDomain(up) : null;
  }

  async findProjectMembers(projectId: string): Promise<IUserProject[]> {
    const ups = await this.userProjectDao.findProjectMembers(projectId);
    return ups.map(u => this.mapToDomain(u));
  }

  async updateRole(userProjectId: string, role: UserProjectRole): Promise<IUserProject | null> {
    const up = await this.userProjectDao.updateRole(userProjectId, role);
    return up ? this.mapToDomain(up) : null;
  }

  async remove(userId: string, projectId): Promise<IUserProject | null> {
    const connection = await this.userProjectDao.findByUserAndProject(userId, projectId);
    const up = await this.userProjectDao.remove(connection._id.toString());
    return up ? this.mapToDomain(up) : null;
  }

  private mapToDomain(doc: UserProjectDocument): IUserProject {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      projectId: doc.projectId.toString(),
      role: doc.role,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}
