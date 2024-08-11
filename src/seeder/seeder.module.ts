import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { UserModule } from 'src/user/user.module';
import { DbModule } from 'src/db/db.module';
import { AdminModule } from 'src/admin/admin.module';
import { User } from 'src/user/entity/user.entity';
import { Network } from 'src/admin/entity/network.entity';
import { Collateral } from 'src/admin/entity/collateral.entity';
import { Supply } from 'src/admin/entity/supply.entity';
import { Setting } from 'src/admin/entity/setting.entity';

@Module({
  providers: [SeederService],
  imports: [
    TypeOrmModule.forFeature([User, Network, Collateral, Supply, Setting]),
    UserModule,
    DbModule,
    AdminModule,
  ],
})
export class SeederModule {}
