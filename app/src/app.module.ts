import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DaoModule } from './modules/data/dao/dao.module';
import { DataModule } from './modules/data/data.module';
import { JwtModule } from './modules/jwt/jwt.module';

@Module({
  providers: [ConfigModule, DaoModule, DataModule, JwtModule],
})
export class AppModule { }
