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

  // findOne(id: number) {
  //   return `This action returns a #${id} admin`;
  // }

  // update(id: number, updateAdminDto: UpdateAdminDto) {
  //   return `This action updates a #${id} admin`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} admin`;
  // }
}
