import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Network } from 'src/network/entity/network.entity';
import { Asset } from 'src/asset/entity/asset.entity';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(
    @InjectRepository(Network)
    private networkRepository: Repository<Network>,

    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
  ) {}

  async getPrice(chainId: number, asset: string) {
    try {
      const token = await this.assetRepository.findOneBy({
        isActive: true,
        chainId,
        symbol: ILike(asset),
      });

      return {
        price: token ? token.price : null,
      };
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
