import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Contract } from './entity/contract.entity';
import { ContractDto } from './dto/contract.dto';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
  ) {}

  async createContract(contractDto: ContractDto) {
    try {
      return await this.contractRepository.save({
        type: contractDto.type,
        address: contractDto.address,
        chainId: contractDto.chainId,
        asset: contractDto.asset,
        isActive: contractDto.isActive,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findAllContract(
    type?: string,
    address?: string,
    chainId?: number,
    asset?: string,
  ) {
    try {
      const searchObj: any = {
        isActive: true,
      };

      if (type) {
        searchObj.type = ILike(`%${type}%`);
      }
      if (address) {
        searchObj.address = ILike(`%${address}%`);
      }
      if (chainId) {
        searchObj.chainId = chainId;
      }
      if (asset) {
        searchObj.asset = ILike(`%${asset}`);
      }

      return await this.contractRepository.findBy(searchObj);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findContract(id: string) {
    try {
      return await this.contractRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async updateContract(id: string, contractDto: ContractDto) {
    try {
      await this.contractRepository.update(id, {
        type: contractDto.type,
        address: contractDto.address,
        chainId: contractDto.chainId,
        asset: contractDto.asset,
        isActive: contractDto.isActive,
      });
      return await this.contractRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async removeContract(id: string) {
    try {
      await this.contractRepository.delete(id);
      return true;
    } catch (e) {
      this.logger.error(
        `[Admin]: Failed to remove contract, id: ${id}, error: ${e.message}`,
      );
      return false;
    }
  }
}
