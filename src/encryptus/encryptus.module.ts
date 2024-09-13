import { Module } from '@nestjs/common';
import { EncryptusService } from './encryptus.service';
import { EncryptusController } from './encryptus.controller';

@Module({
  controllers: [EncryptusController],
  providers: [EncryptusService],
})
export class EncryptusModule {}
