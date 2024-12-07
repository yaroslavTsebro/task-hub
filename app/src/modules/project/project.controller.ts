import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { IUser } from 'src/shared/contracts/entity/user';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ProjectRoles } from 'src/shared/decorators/project-roles.decorator';
import { UserProjectRole } from 'src/shared/dto/entities/user-project';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { ProjectGuard } from '../auth/guards/project.guard';
import { InviteUserDto } from 'src/shared/dto/project/user/invite';
import { UpdateUserProjectDto } from 'src/shared/dto/project/user/update';
import { CreateProjectDto } from 'src/shared/dto/project/create';
import { UpdateProjectDto } from 'src/shared/dto/project/update';

@ApiTags('projects')
@Controller('projects')
@UseGuards(AuthorizationGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: IUser,
  ) {
    return this.projectService.createProject(createProjectDto, user);
  }

  @Patch(':id')
  @UseGuards(ProjectGuard)
  @ProjectRoles(UserProjectRole.OWNER, UserProjectRole.ADMIN)
  async updateProject(
    @Param('id') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(projectId, updateProjectDto);
  }

  @Get()
  async getAllProjects(@CurrentUser() user: IUser) {
    return this.projectService.getAllProjects(user);
  }


  @Post(':id/users/invite')
  @UseGuards(ProjectGuard)
  @ProjectRoles(UserProjectRole.OWNER, UserProjectRole.ADMIN)
  async inviteUser(
    @Param('id') projectId: string,
    @Body() inviteUserDto: InviteUserDto,
  ) {
    return this.projectService.inviteUserToProject(projectId, inviteUserDto);
  }

  @Delete(':id/users/remove')
  @UseGuards(ProjectGuard)
  @ProjectRoles(UserProjectRole.OWNER, UserProjectRole.ADMIN)
  async removeUser(
    @Param('id') projectId: string,
    @Body('userId') userId: string,
  ) {
    return this.projectService.removeUserFromProject(projectId, userId);
  }


  @Patch(':id/users/change-role')
  @UseGuards(ProjectGuard)
  @ProjectRoles(UserProjectRole.OWNER, UserProjectRole.ADMIN)
  async changeUserRole(
    @Param('id') projectId: string,
    @Body() changeUserRoleDto: UpdateUserProjectDto,
  ) {
    return this.projectService.changeUserRole(projectId, changeUserRoleDto);
  }
}
