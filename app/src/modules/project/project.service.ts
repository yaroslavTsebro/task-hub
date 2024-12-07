import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from 'src/shared/contracts/entity/user';
import { UserProjectRole } from 'src/shared/dto/entities/user-project';
import { ProjectRepository } from '../data/repository/project.repository';
import { UserProjectRepository } from '../data/repository/user-project.repository';
import { InviteUserDto } from 'src/shared/dto/project/user/invite';
import { UpdateUserProjectDto } from 'src/shared/dto/project/user/update';
import { CreateProjectDto } from 'src/shared/dto/project/create';
import { UpdateProjectDto } from 'src/shared/dto/project/update';


@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepo: ProjectRepository,
    private readonly userProjectRepo: UserProjectRepository,
  ) { }

  async createProject(
    createProjectDto: CreateProjectDto,
    user: IUser,
  ) {
    const project = await this.projectRepo.create(
      createProjectDto.name,
      createProjectDto.description,
    );
    await this.userProjectRepo.addUserToProject(
      user.id,
      project.id,
      UserProjectRole.OWNER,
    );
    return project;
  }

  async updateProject(
    projectId: string,
    updateProjectDto: UpdateProjectDto,
  ) {

    const updatedProject = await this.projectRepo.update(
      projectId,
      updateProjectDto,
    );

    if (!updatedProject) { throw new NotFoundException('Project not found'); }

    return updatedProject;
  }

  async getAllProjects(user: IUser): Promise<any[]> {
    const userProjects = await this.userProjectRepo.findProjectsByUser(user.id);
    const projectIds = userProjects.map((up) => up.projectId);
    return this.projectRepo.findByIds(projectIds);
  }

  async inviteUserToProject(
    projectId: string,
    inviteUserDto: InviteUserDto,
  ): Promise<any> {
    return this.userProjectRepo.addUserToProject(inviteUserDto.userId, projectId, inviteUserDto.role as unknown as UserProjectRole);
  }

  async removeUserFromProject(
    projectId: string,
    userId: string,
  ): Promise<void> {
    await this.userProjectRepo.remove(userId, projectId);
  }

  async changeUserRole(
    projectId: string,
    changeUserRoleDto: UpdateUserProjectDto,
  ): Promise<any> {
    return this.userProjectRepo.updateRole(changeUserRoleDto.userId, changeUserRoleDto.role as unknown as UserProjectRole);
  }
}

