import {
  Injectable,
  HttpException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collateral } from './entity/collateral.entity';
import { CollateralDto } from './dto/collateral.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
  ) {}

  async createCollateral(collateralDto: CollateralDto) {
    try {
      return await this.collateralRepository.save({
        type: collateralDto.type,
        name: collateralDto.name,
        chain: collateralDto.chain,
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
        name: collateralDto.name,
        chain: collateralDto.chain,
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
