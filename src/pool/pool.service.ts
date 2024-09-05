import { Injectable, HttpException, Logger, Inject } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Contract } from 'src/contract/entity/contract.entity';
import { Network } from 'src/network/entity/network.entity';
import { Asset } from 'src/asset/entity/asset.entity';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import * as fs from 'fs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const abi = JSON.parse(fs.readFileSync('abi/CCFLPool.json', 'utf8'));

@Injectable()
export class PoolService {
  private readonly logger = new Logger(PoolService.name);

  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,

    @InjectRepository(Network)
    private networkRepository: Repository<Network>,

    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,

    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getAllPool(chainId: number) {
    try {
      const key = `getAllPool_${chainId}`;
      const cacheData = await this.cacheManager.get(key);
      if (cacheData) {
        this.logger.log(`\n:return:cache:${key}`);
        return cacheData;
      }

      const [network, allPools] = await Promise.all([
        this.networkRepository.findOneBy({
          chainId,
        }),
        this.contractRepository.findBy({
          isActive: true,
          type: ILike('pool'),
          chainId,
        }),
      ]);

      if (!network) {
        return [];
      }

      const provider = new ethers.JsonRpcProvider(network.rpcUrl);

      const finalData = [];
      for (const item of allPools) {
        const contract = new ethers.Contract(item.address, abi, provider);

        const [loan_available, currentRate, asset] = await Promise.all([
          contract.getRemainingPool(),
          contract.getCurrentRate(),
          this.assetRepository.findOneBy({
            isActive: true,
            chainId,
            symbol: ILike(item.asset),
          }),
        ]);

        const apr = BigNumber(currentRate[1]).div(1e27).toFixed(8);
        const seconds = ConfigService.App.seconds_per_year;
        const apy = ((1 + (parseFloat(apr) / seconds)) ** seconds) - 1;

        finalData.push({
          asset: item.asset,
          decimals: asset.decimals,
          loan_available: BigNumber(loan_available).toFixed(),
          apy: BigNumber(apy).toFixed(8),
        });
      }

      this.cacheManager.store.set(key, finalData, ConfigService.Cache.ttl);

      return finalData;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
