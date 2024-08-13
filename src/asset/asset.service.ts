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

  async findAllAsset(query: any) {
    try {
      const searchObj: any = {
        isActive: true,
      };

      if (query.category) {
        searchObj.category = ILike(`%${query.category}%`);
      }
      if (query.type) {
        searchObj.type = ILike(`%${query.type}%`);
      }
      if (query.chainName) {
        searchObj.chainName = ILike(`%${query.chainName}%`);
      }
      if (query.chainId) {
        searchObj.chainId = query.chainId;
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
      if (query.coingeckoId) {
        searchObj.coingeckoId = ILike(`%${query.coingeckoId}`);
      }
      if (query.isMainnet) {
        searchObj.isMainnet = query.isMainnet;
      }

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
