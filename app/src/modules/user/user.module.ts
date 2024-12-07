import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DataModule } from '../data/data.module';

@Module({
  imports: [DataModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
