import { SetMetadata } from '@nestjs/common';
import { UserProjectRole } from '../dto/entities/user-project';

export const PROJECT_ROLES_KEY = 'project_roles';

export const ProjectRoles = (...roles: UserProjectRole[]) => SetMetadata(PROJECT_ROLES_KEY, roles);