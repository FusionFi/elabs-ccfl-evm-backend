import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Contract } from 'src/contract/entity/contract.entity';
import { Network } from 'src/network/entity/network.entity'
import { ethers } from 'ethers';
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
        type: ILike(`%pool%`),
        chainId: chainId,
      });

      console.log('allPools: ', allPools);

      const network = await this.networkRepository.findOneBy({
        chainId
      });
      console.log('network: ', network);

      if (!network) {
        return [];
      }

      const provider = new ethers.JsonRpcProvider(network.rpcUrl);

      let finalData = [];
      for (let item of allPools) {
        let contract = new ethers.Contract(item.address, abi, provider);
        let loan_available = await contract.getRemainingPool();
        console.log('loan_available: ', BigInt(loan_available).toString());
        finalData.push({
          asset: item.asset,
          loan_available: BigInt(loan_available).toString(),
          apr: '0.07'
        });
      }
      return finalData;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
