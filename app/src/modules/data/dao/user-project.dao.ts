import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProject, UserProjectDocument, UserProjectRole } from 'src/shared/dto/entities/user-project';

@Injectable()
export class UserProjectDao {
  constructor(@InjectModel(UserProject.name) private userProjectModel: Model<UserProjectDocument>) {}

  async addUserToProject(userId: string, projectId: string, role: UserProjectRole = UserProjectRole.WORKER): Promise<UserProjectDocument> {
    const userProject = new this.userProjectModel({ userId, projectId, role });
    return userProject.save();
  }

  async findByUserAndProject(userId: string, projectId: string): Promise<UserProjectDocument | null> {
    return this.userProjectModel.findOne({ userId, projectId }).exec();
  }

  async findProjectMembers(projectId: string): Promise<UserProjectDocument[]> {
    return this.userProjectModel.find({ projectId }).exec();
  }

  async updateRole(userProjectId: string, role: UserProjectRole): Promise<UserProjectDocument | null> {
    return this.userProjectModel.findByIdAndUpdate(userProjectId, { role }, { new: true }).exec();
  }

  async remove(userProjectId: string): Promise<UserProjectDocument | null> {
    return this.userProjectModel.findByIdAndDelete(userProjectId).exec();
  }
}
