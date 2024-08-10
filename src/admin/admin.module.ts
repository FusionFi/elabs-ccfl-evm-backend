import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collateral } from './entity/collateral.entity';
import { Supply } from './entity/supply.entity';
import { Setting } from './entity/setting.entity';
import { Network } from './entity/network.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collateral, Supply, Setting, Network])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
