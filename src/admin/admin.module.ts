import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collateral } from './entity/collateral.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collateral])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
