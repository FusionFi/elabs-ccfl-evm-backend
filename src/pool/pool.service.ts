import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Contract } from 'src/contract/entity/contract.entity';
import { Network } from 'src/network/entity/network.entity';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import * as fs from 'fs';

const abi = JSON.parse(fs.readFileSync('abi/CCFLPool.json', 'utf8'));

@Injectable()
export class PoolService {
  private readonly logger = new Logger(PoolService.name);

  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,

    @InjectRepository(Network)
    private networkRepository: Repository<Network>,
  ) {}

  async findAllPool(chainId: number) {
    try {
      const allPools = await this.contractRepository.findBy({
        isActive: true,
        type: ILike('pool'),
        chainId: chainId,
      });

      const network = await this.networkRepository.findOneBy({
        chainId,
      });

      if (!network) {
        return [];
      }

      const provider = new ethers.JsonRpcProvider(network.rpcUrl);

      const finalData = [];
      for (const item of allPools) {
        const contract = new ethers.Contract(item.address, abi, provider);
        const loan_available = await contract.getRemainingPool();
        const apr = await contract.getCurrentRate();

        finalData.push({
          asset: item.asset,
          loan_available: BigNumber(loan_available).toFixed(),
          apr: BigNumber(apr[0]).div(1e27).toFixed(),
        });
      }
      return finalData;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
