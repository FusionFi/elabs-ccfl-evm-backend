import { Module } from '@nestjs/common';
import { NetworkService } from './network.service';
import { NetworkController } from './network.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Network } from './entity/network.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Network])],
  controllers: [NetworkController],
  providers: [NetworkService],
})
export class NetworkModule {}
