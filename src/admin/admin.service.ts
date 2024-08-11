import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Collateral } from './entity/collateral.entity';
import { CollateralDto } from './dto/collateral.dto';
import { Supply } from './entity/supply.entity';
import { SupplyDto } from './dto/supply.dto';
import { Setting } from './entity/setting.entity';
import { SettingDto } from './dto/setting.dto';
import { Network } from './entity/network.entity';
import { NetworkDto } from './dto/network.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,

    @InjectRepository(Supply)
    private supplyRepository: Repository<Supply>,

    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,

    @InjectRepository(Network)
    private networkRepository: Repository<Network>,
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

  async findAllSupply() {
    try {
      return await this.supplyRepository.findBy({
        isActive: true,
      });
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

  async createSetting(settingDto: SettingDto) {
    try {
      return await this.settingRepository.save({
        key: settingDto.key,
        value: settingDto.value,
        type: settingDto.type,
        isActive: settingDto.isActive,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findAllSetting(key: string) {
    try {
      return await this.settingRepository.findBy({
        isActive: true,
        key: ILike(`%${key}%`),
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findSetting(id: string) {
    try {
      return await this.settingRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async updateSetting(id: string, settingDto: SettingDto) {
    try {
      await this.settingRepository.update(id, {
        key: settingDto.key,
        value: settingDto.value,
        type: settingDto.type,
        isActive: settingDto.isActive,
      });
      return await this.settingRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async removeSetting(id: string) {
    try {
      await this.settingRepository.delete(id);
      return true;
    } catch (e) {
      this.logger.error(
        `[Admin]: Failed to remove setting, id: ${id}, error: ${e.message}`,
      );
      return false;
    }
  }

  async createNetwork(networkDto: NetworkDto) {
    try {
      return await this.networkRepository.save({
        name: networkDto.name,
        code: networkDto.code,
        chainId: networkDto.chainId,
        txUrl: networkDto.txUrl,
        rpcUrl: networkDto.rpcUrl,
        isMainnet: networkDto.isMainnet,
        isActive: networkDto.isActive,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findAllNetwork() {
    try {
      return await this.networkRepository.findBy({
        isActive: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findNetwork(id: string) {
    try {
      return await this.networkRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async updateNetwork(id: string, networkDto: NetworkDto) {
    try {
      await this.networkRepository.update(id, {
        name: networkDto.name,
        code: networkDto.code,
        chainId: networkDto.chainId,
        txUrl: networkDto.txUrl,
        rpcUrl: networkDto.rpcUrl,
        isMainnet: networkDto.isMainnet,
        isActive: networkDto.isActive,
      });
      return await this.networkRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async removeNetwork(id: string) {
    try {
      await this.networkRepository.delete(id);
      return true;
    } catch (e) {
      this.logger.error(
        `[Admin]: Failed to remove network, id: ${id}, error: ${e.message}`,
      );
      return false;
    }
  }
}
