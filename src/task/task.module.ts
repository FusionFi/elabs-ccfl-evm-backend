import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from 'src/asset/entity/asset.entity';
import { Network } from 'src/network/entity/network.entity';
import { Contract } from 'src/contract/entity/contract.entity';
import { Fiat } from 'src/fiat/entity/fiat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, Network, Contract, Fiat])],
  providers: [TaskService],
})
export class TaskModule {}
