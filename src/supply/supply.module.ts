import { Module } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { SupplyController } from './supply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supply } from './entity/supply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supply])],
  controllers: [SupplyController],
  providers: [SupplyService],
})
export class SupplyModule {}
