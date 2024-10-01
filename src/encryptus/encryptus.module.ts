import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptusService } from './encryptus.service';
import { EncryptusController } from './encryptus.controller';
import { Setting } from 'src/setting/entity/setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [EncryptusController],
  providers: [EncryptusService],
})
export class EncryptusModule {}
