import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PROJECT_ROLES_KEY } from '../../../shared/decorators/project-roles.decorator';
import { UserProjectRepository } from 'src/modules/data/repository/user-project.repository';
import { UserProjectRole } from '../../../shared/dto/entities/user-project';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(
    private readonly userProjectRepo: UserProjectRepository,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectId = request.params.projectId;

    if (!user || !projectId) { throw new ForbiddenException('Missing user or projectId'); }

    const requiredRoles = this.reflector.get<UserProjectRole[]>(PROJECT_ROLES_KEY, context.getHandler()) || [];

    const userProject = await this.userProjectRepo.findByUserAndProject(user.id, projectId);

    if (!userProject) { throw new ForbiddenException('You are not a member of this project'); }
    if (requiredRoles.length === 0) { return true; }
    if (!requiredRoles.includes(userProject.role)) { throw new ForbiddenException('You do not have the required role to access this resource'); }

    return true;
  }
}
