import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UserModule } from 'src/user/user.module';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [SeederService],
  imports: [UserModule, DbModule],
})
export class SeederModule {}
