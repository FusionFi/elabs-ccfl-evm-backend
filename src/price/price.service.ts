import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Network } from 'src/network/entity/network.entity';
import { Asset } from 'src/asset/entity/asset.entity';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import * as fs from 'fs';

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
      const network = await this.networkRepository.findOneBy({
        chainId,
      });

      if (!network) {
        return {
          price: null,
        };
      }

      const token = await this.assetRepository.findOneBy({
        isActive: true,
        chainId,
        symbol: ILike(asset),
      });

      if (!token) {
        return {
          price: null,
        };
      }

      return {
        price: token.price,
      };
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
