import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DaoModule } from './modules/data/dao/dao.module';
import { DataModule } from './modules/data/data.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  providers: [ConfigModule, DaoModule, DataModule, JwtModule, AuthModule, UserModule],
  imports: [UserModule],
})
export class AppModule { }
