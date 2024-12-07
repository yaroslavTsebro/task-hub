import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { JwtModule } from '../jwt/jwt.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthorizationGuard } from './guards/authorization.guard';
import { ProjectGuard } from './guards/project.guard';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    JwtModule,
    DataModule,
    UserModule,
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthorizationGuard, ProjectGuard],
})
export class AuthModule { }
