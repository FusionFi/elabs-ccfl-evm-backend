import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from 'src/asset/entity/asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  providers: [TaskService],
})
export class TaskModule {}
