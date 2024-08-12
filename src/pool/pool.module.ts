import { Module } from '@nestjs/common';
import { PoolService } from './pool.service';
import { PoolController } from './pool.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PoolController],
  providers: [PoolService],
})
export class PoolModule {}
