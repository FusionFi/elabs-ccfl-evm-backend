import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Fiat } from './entity/fiat.entity';

@Injectable()
export class FiatService {
  private readonly logger = new Logger(FiatService.name);

  constructor(
    @InjectRepository(Fiat)
    private fiatRepository: Repository<Fiat>,
  ) {}

  async findAllFiatPrice(
    currency: string,
  ) {
    try {
      const searchObj: any = {};

      if (currency) {
        searchObj.currency = ILike(`%${currency}%`);
      }

      return await this.fiatRepository.findBy(searchObj);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
