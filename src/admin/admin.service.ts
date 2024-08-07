import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collateral } from './entity/collateral.entity';
import { CollateralDto } from './dto/collateral.dto';
import { Supply } from './entity/supply.entity';
import { SupplyDto } from './dto/supply.dto';
import { Setting } from './entity/setting.entity';
import { SettingDto } from './dto/setting.dto';

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
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findAllCollateral() {
    try {
      return await this.collateralRepository.find();
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
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findAllSupply() {
    try {
      return await this.supplyRepository.find();
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
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findAllSetting() {
    try {
      return await this.settingRepository.find();
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
}
