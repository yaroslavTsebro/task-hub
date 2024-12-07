import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserProject, UserProjectDocument, UserProjectRole } from 'src/shared/dto/entities/user-project';

@Injectable()
export class UserProjectDao {
  constructor(@InjectModel(UserProject.name) private userProjectModel: Model<UserProjectDocument>) {}

  async addUserToProject(userId: string, projectId: string, role: UserProjectRole = UserProjectRole.WORKER): Promise<UserProjectDocument> {
    const userObjectId = new Types.ObjectId(userId);
    const projectObjectId = new Types.ObjectId(projectId);

    const userProject = new this.userProjectModel({ userId: userObjectId, projectId: projectObjectId, role });
    return userProject.save();
  }

  async findByUserAndProject(userId: string, projectId: string): Promise<UserProjectDocument | null> {
    const userObjectId = new Types.ObjectId(userId);
    const projectObjectId = new Types.ObjectId(projectId);

    return this.userProjectModel.findOne({ userId: userObjectId, projectId: projectObjectId }).exec();
  }

  async findProjectMembers(projectId: string): Promise<UserProjectDocument[]> {
    const projectObjectId = new Types.ObjectId(projectId);
    return this.userProjectModel.find({ projectId: projectObjectId }).exec();
  }

  async updateRole(userProjectId: string, role: UserProjectRole): Promise<UserProjectDocument | null> {
    const userProjectObjectId = new Types.ObjectId(userProjectId);
    return this.userProjectModel.findByIdAndUpdate(userProjectObjectId, { role }, { new: true }).exec();
  }

  async remove(userProjectId: string): Promise<UserProjectDocument | null> {
    const userProjectObjectId = new Types.ObjectId(userProjectId);
    return this.userProjectModel.findByIdAndDelete(userProjectObjectId).exec();
  }
}
