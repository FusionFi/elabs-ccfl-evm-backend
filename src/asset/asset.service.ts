import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Asset } from './entity/asset.entity';
import { AssetDto } from './dto/asset.dto';

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);

  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
  ) {}

  async createAsset(assetDto: AssetDto) {
    try {
      return await this.assetRepository.save({
        category: assetDto.category,
        type: assetDto.type,
        chainName: assetDto.chainName,
        chainId: assetDto.chainId,
        name: assetDto.name,
        symbol: assetDto.symbol,
        address: assetDto.address,
        decimals: assetDto.decimals,
        coingeckoId: assetDto.coingeckoId,
        isMainnet: assetDto.isMainnet,
        isActive: assetDto.isActive,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findAllAsset(
    category?: string,
    type?: string,
    chainName?: string,
    chainId?: number,
    name?: string,
    symbol?: string,
    address?: string,
    isMainnet?: boolean,
  ) {
    try {
      const searchObj: any = {
        isActive: true,
      };

      if (category) {
        searchObj.category = ILike(`%${category}%`);
      }
      if (type) {
        searchObj.type = ILike(`%${type}%`);
      }
      if (chainName) {
        searchObj.chainName = ILike(`%${chainName}%`);
      }
      if (chainId) {
        searchObj.chainId = chainId;
      }
      if (name) {
        searchObj.name = ILike(`%${name}`);
      }
      if (symbol) {
        searchObj.symbol = ILike(`%${symbol}`);
      }
      if (address) {
        searchObj.address = ILike(`%${address}`);
      }
      searchObj.isMainnet = isMainnet;

      return await this.assetRepository.findBy(searchObj);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findAsset(id: string) {
    try {
      return await this.assetRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async updateAsset(id: string, assetDto: AssetDto) {
    try {
      await this.assetRepository.update(id, {
        category: assetDto.category,
        type: assetDto.type,
        chainName: assetDto.chainName,
        chainId: assetDto.chainId,
        name: assetDto.name,
        symbol: assetDto.symbol,
        address: assetDto.address,
        decimals: assetDto.decimals,
        coingeckoId: assetDto.coingeckoId,
        isMainnet: assetDto.isMainnet,
        isActive: assetDto.isActive,
      });
      return await this.assetRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async removeAsset(id: string) {
    try {
      await this.assetRepository.delete(id);
      return true;
    } catch (e) {
      this.logger.error(
        `[Admin]: Failed to remove asset, id: ${id}, error: ${e.message}`,
      );
      return false;
    }
  }
}
