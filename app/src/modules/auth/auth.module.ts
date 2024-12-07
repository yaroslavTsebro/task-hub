import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { JwtModule } from '../jwt/jwt.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthorizationGuard } from './guards/authorization.guard';
import { ProjectGuard } from './guards/project.guard';

@Module({
  imports: [
    JwtModule,
    DataModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthorizationGuard, ProjectGuard],
})
export class AuthModule { }
