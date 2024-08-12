import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Supply } from './entity/supply.entity';
import { SupplyDto } from './dto/supply.dto';

@Injectable()
export class SupplyService {
  private readonly logger = new Logger(SupplyService.name);

  constructor(
    @InjectRepository(Supply)
    private supplyRepository: Repository<Supply>,
  ) {}

  async createSupply(supplyDto: SupplyDto) {
    try {
      return await this.supplyRepository.save({
        chain: supplyDto.chain,
        name: supplyDto.name,
        symbol: supplyDto.symbol,
        address: supplyDto.address,
        decimals: supplyDto.decimals,
        isMainnet: supplyDto.isMainnet,
        isActive: supplyDto.isActive,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findAllSupply(query: any) {
    try {
      const searchObj: any = {
        isActive: true,
      };

      if (query.chain) {
        searchObj.chain = ILike(`%${query.chain}%`);
      }
      if (query.name) {
        searchObj.name = ILike(`%${query.name}`);
      }
      if (query.symbol) {
        searchObj.symbol = ILike(`%${query.symbol}`);
      }
      if (query.address) {
        searchObj.address = ILike(`%${query.address}`);
      }
      if (query.decimals) {
        searchObj.decimals = query.decimals;
      }
      if (query.isMainnet) {
        searchObj.isMainnet = query.isMainnet;
      }

      return await this.supplyRepository.findBy(searchObj);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findSupply(id: string) {
    try {
      return await this.supplyRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async updateSupply(id: string, supplyDto: SupplyDto) {
    try {
      await this.supplyRepository.update(id, {
        chain: supplyDto.chain,
        name: supplyDto.name,
        symbol: supplyDto.symbol,
        address: supplyDto.address,
        decimals: supplyDto.decimals,
        isMainnet: supplyDto.isMainnet,
        isActive: supplyDto.isActive,
      });
      return await this.supplyRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async removeSupply(id: string) {
    try {
      await this.supplyRepository.delete(id);
      return true;
    } catch (e) {
      this.logger.error(
        `[Admin]: Failed to remove supply, id: ${id}, error: ${e.message}`,
      );
      return false;
    }
  }
}
