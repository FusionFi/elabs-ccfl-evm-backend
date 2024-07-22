import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { ethers } from 'ethers';

@Injectable()
export class EventService implements OnModuleInit {
  private readonly logger = new Logger(EventService.name);
  private provider: ethers.Provider;
  private contract: ethers.Contract;

  private readonly USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // USDT contract address
  private readonly USDT_ABI = [
    'event Transfer(address indexed from,address indexed to,uint value)',
  ];

  async onModuleInit() {
    this.provider = new ethers.JsonRpcProvider(
      `${ConfigService.Rpc.url}?key=${ConfigService.Rpc.key}`,
    );
    this.contract = new ethers.Contract(
      this.USDT_ADDRESS,
      this.USDT_ABI,
      this.provider,
    );

    this.subscribeToTransferEvents();
  }

  private subscribeToTransferEvents() {
    this.contract.on('Transfer', (from, to, value) => {
      this.logger.log(
        `Transfer detected: from ${from} to ${to} value ${ethers.formatUnits(value, 6)}`,
      );
      // Add your handling logic here
    });
  }
}
