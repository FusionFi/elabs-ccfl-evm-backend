import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from 'src/contract/entity/contract.entity';
import { Network } from 'src/network/entity/network.entity';
import { Asset } from 'src/asset/entity/asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, Network, Asset])],
  controllers: [PriceController],
  providers: [PriceService],
})
export class PriceModule {}
