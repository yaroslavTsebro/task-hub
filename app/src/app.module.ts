import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DaoModule } from './modules/data/dao/dao.module';
import { DataModule } from './modules/data/data.module';

@Module({
  providers: [ConfigModule, DaoModule, DataModule],
})
export class AppModule { }
