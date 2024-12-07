import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
@Module({
  providers: [ConfigModule],
})
export class AppModule {}
