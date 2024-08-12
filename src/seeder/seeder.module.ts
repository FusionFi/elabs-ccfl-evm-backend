import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { UserModule } from 'src/user/user.module';
import { DbModule } from 'src/db/db.module';
import { User } from 'src/user/entity/user.entity';
import { Network } from 'src/network/entity/network.entity';
import { Collateral } from 'src/collateral/entity/collateral.entity';
import { Supply } from 'src/supply/entity/supply.entity';
import { Setting } from 'src/setting/entity/setting.entity';

@Module({
  providers: [SeederService],
  imports: [
    TypeOrmModule.forFeature([User, Network, Collateral, Supply, Setting]),
    UserModule,
    DbModule,
  ],
})
export class SeederModule {}
