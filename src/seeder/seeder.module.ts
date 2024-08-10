import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { UserModule } from 'src/user/user.module';
import { DbModule } from 'src/db/db.module';
import { AdminModule } from 'src/admin/admin.module';
import { User } from 'src/user/entity/user.entity';
import { Network } from 'src/admin/entity/network.entity';

@Module({
  providers: [SeederService],
  imports: [
    TypeOrmModule.forFeature([User, Network]),
    UserModule,
    DbModule,
    AdminModule
  ],
})
export class SeederModule {}
