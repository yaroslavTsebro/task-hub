import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { DataModule } from '../data/data.module';

@Module({
  imports: [DataModule],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}
