import { Module } from '@nestjs/common';
import { FiatService } from './fiat.service';
import { FiatController } from './fiat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fiat } from './entity/fiat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fiat])],
  controllers: [FiatController],
  providers: [FiatService],
})
export class FiatModule {}
