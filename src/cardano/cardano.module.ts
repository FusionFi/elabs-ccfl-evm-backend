import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardanoService } from './cardano.service';
import { CardanoController } from './cardano.controller';
import { CardanoLoan } from './entity/cardano-loan.entity';
import { OracleData } from './entity/oracle-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardanoLoan, OracleData])],
  controllers: [CardanoController],
  providers: [CardanoService],
  exports: [CardanoService],
})
export class CardanoModule {}
