import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collateral } from './entity/collateral.entity';
import { CollateralDto } from './dto/collateral.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>
  ) {}

  async createCollateral(collateralDto: CollateralDto) {
    return await this.collateralRepository.save({
      type: collateralDto.type,
      name: collateralDto.name,
      chain: collateralDto.chain
    });
  }

  async findAllCollateral() {
    return await this.collateralRepository.find();
  }

  async findCollateral(id: string) {
    return await this.collateralRepository.findOneBy({ id });
  }

  async updateCollateral(id: string, collateralDto: CollateralDto) {
    await this.collateralRepository.update(id, {
      type: collateralDto.type,
      name: collateralDto.name,
      chain: collateralDto.chain
    });
    return await this.collateralRepository.findOneBy({ id });
  }

  async removeCollateral(id: string) {
    await this.collateralRepository.delete(id);
    return true;
  }
}
