import { Module } from '@nestjs/common';
import { CollateralService } from './collateral.service';
import { CollateralController } from './collateral.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collateral } from './entity/collateral.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collateral])],
  controllers: [CollateralController],
  providers: [CollateralService],
})
export class CollateralModule {}
