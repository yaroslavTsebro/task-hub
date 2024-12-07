import { Module } from '@nestjs/common';
import { DaoModule } from './dao/dao.module';
import { TaskRepository } from './repository/task.repository';
import { ProjectRepository } from './repository/project.repository';
import { UserProjectRepository } from './repository/user-project.repository';
import { UserTaskRepository } from './repository/user-task.repository';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [DaoModule],
  providers: [
    UserRepository,
    ProjectRepository,
    TaskRepository,
    UserProjectRepository,
    UserTaskRepository,
  ],
  exports: [
    UserRepository,
    ProjectRepository,
    TaskRepository,
    UserProjectRepository,
    UserTaskRepository,
  ],
})
export class DataModule{}
