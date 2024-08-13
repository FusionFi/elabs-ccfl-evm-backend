import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Network } from './entity/network.entity';
import { NetworkDto } from './dto/network.dto';

@Injectable()
export class NetworkService {
  private readonly logger = new Logger(NetworkService.name);

  constructor(
    @InjectRepository(Network)
    private networkRepository: Repository<Network>,
  ) {}

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

  async findAllNetwork(name: string, code: string, chainId: number, isMainnet: boolean) {
    try {
      const searchObj: any = {
        isActive: true,
      };

      if (name) {
        searchObj.name = ILike(`%${name}%`);
      }
      if (code) {
        searchObj.code = ILike(`%${code}%`);
      }
      if (chainId) {
        searchObj.chainId = chainId;
      }
      searchObj.isMainnet = isMainnet;

      return await this.networkRepository.findBy(searchObj);
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
        `[Network]: Failed to remove network, id: ${id}, error: ${e.message}`,
      );
      return false;
    }
  }
}
