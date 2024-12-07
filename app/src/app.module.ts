import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DaoModule } from './modules/data/dao/dao.module';
import { DataModule } from './modules/data/data.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/project/project.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [ConfigModule, DaoModule, DataModule, JwtModule, AuthModule, UserModule, ProjectModule, TaskModule]
})
export class AppModule { }
