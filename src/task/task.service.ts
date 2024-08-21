import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from 'src/asset/entity/asset.entity';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { ConfigService } from 'src/config/config.service';
import axios from 'axios';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
  ) {}

  @Cron('*/1 * * * *')
  // @Interval(1000)
  async handleCron() {
    try {
      this.logger.log('Called every 1 minute to update all prices');
      const data = await this.assetRepository
        .createQueryBuilder('asset')
        .select('DISTINCT(asset.coingecko_id)')
        .getRawMany();
      const allCgcIds = data.map((item) => item.coingecko_id).join(',');
      console.log('allCgcIds: ', allCgcIds);

      const coingeckoUrl = ConfigService.Coingecko.url;

      const price = await axios.get(`${coingeckoUrl}/v3/simple/price`, {
        params: {
          ids: allCgcIds,
          vs_currencies: 'usd',
        },
      });

      console.log('price: ', price.data);

      for (let item in price.data) {
        await this.assetRepository.update(
          { coingeckoId: item },
          { price: price.data[item]['usd'] },
        );
      }
      this.logger.log('Done for updating all prices');
    } catch (e) {
      this.logger.error(`Error in updating all prices from coingecko: ${e}`);
      throw e;
    }
  }

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  // }

  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.debug('Called once after 5 seconds');
  // }
}
