import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Project, ProjectSchema } from 'src/shared/dto/entities/project';
import { Task, TaskSchema } from 'src/shared/dto/entities/task';
import { User, UserSchema } from 'src/shared/dto/entities/user';
import { UserProject, UserProjectSchema } from 'src/shared/dto/entities/user-project';
import { UserTask, UserTaskSchema } from 'src/shared/dto/entities/user-task';
import { ProjectDao } from './project.dao';
import { TaskDao } from './task.dao';
import { UserProjectDao } from './user-project.dao';
import { UserTaskDao } from './user-task.dao';
import { UserDao } from './user.dao';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        console.log('Connecting to MongoDB at:', uri);
        return { uri };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Task.name, schema: TaskSchema },
      { name: UserProject.name, schema: UserProjectSchema },
      { name: UserTask.name, schema: UserTaskSchema },
    ]),
  ],
  providers: [
    UserDao,
    ProjectDao,
    TaskDao,
    UserProjectDao,
    UserTaskDao,
  ],
  exports: [
    UserDao,
    ProjectDao,
    TaskDao,
    UserProjectDao,
    UserTaskDao,
  ],
})
export class DaoModule {}
