import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Collateral } from './entity/collateral.entity';
import { CollateralDto } from './dto/collateral.dto';

@Injectable()
export class CollateralService {
  private readonly logger = new Logger(CollateralService.name);

  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
  ) {}

  async createCollateral(collateralDto: CollateralDto) {
    try {
      return await this.collateralRepository.save({
        type: collateralDto.type,
        chain: collateralDto.chain,
        name: collateralDto.name,
        symbol: collateralDto.symbol,
        address: collateralDto.address,
        decimals: collateralDto.decimals,
        isMainnet: collateralDto.isMainnet,
        isActive: collateralDto.isActive,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findAllCollateral(query: any) {
    try {
      const searchObj: any = {
        isActive: true,
      };

      if (query.type) {
        searchObj.type = ILike(`%${query.type}%`);
      }
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

      return await this.collateralRepository.findBy(searchObj);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findCollateral(id: string) {
    try {
      return await this.collateralRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async updateCollateral(id: string, collateralDto: CollateralDto) {
    try {
      await this.collateralRepository.update(id, {
        type: collateralDto.type,
        chain: collateralDto.chain,
        name: collateralDto.name,
        symbol: collateralDto.symbol,
        address: collateralDto.address,
        decimals: collateralDto.decimals,
        isMainnet: collateralDto.isMainnet,
        isActive: collateralDto.isActive,
      });
      return await this.collateralRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async removeCollateral(id: string) {
    try {
      await this.collateralRepository.delete(id);
      return true;
    } catch (e) {
      this.logger.error(
        `[Admin]: Failed to remove collateral, id: ${id}, error: ${e.message}`,
      );
      return false;
    }
  }
}
