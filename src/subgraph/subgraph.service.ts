import { Injectable, Logger, HttpException, Inject } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class SubgraphService {
  private readonly logger = new Logger(SubgraphService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async querySubgraph(query: string, variables: string) {
    try {
      const key = `querySubgraph_${JSON.stringify(query)}_${JSON.stringify(variables)}`;
      const cacheData = await this.cacheManager.get(key);
      if (cacheData) {
        this.logger.log(`\n:return:cache:${key}`);
        return cacheData;
      }

      const config = {
        method: 'POST',
        url: ConfigService.Subgraph.url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          query: query,
          variables: variables,
        }),
      };

      const response = await axios(config);
      const data = response.data;

      this.cacheManager.store.set(key, data, ConfigService.Cache.ttl);

      return data;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async getHistory(address: string, offset: number, limit: number) {
    try {
      let history = [];
      let allData = [];

      const key = `getHistory_${address}`;
      const cacheData = await this.cacheManager.get(key);
      if (cacheData) {
        this.logger.log(`\n:return:cache:${key}`);
        history = (cacheData as Array<any>).slice(offset, offset + limit);
        return {
          offset,
          limit,
          total: (cacheData as Array<any>).length,
          history
        };
      }

      const configAddSupply = {
        method: 'POST',
        url: ConfigService.Subgraph.url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          query: `query addSupplies (
              $address: Bytes!
          ) {
              addSupplies (
                  orderBy: blockTimestamp
                  orderDirection: desc
                  where: {
                      lender: $address
                  }
              ) {
                  lender
                  supply
                  amount
                  blockNumber
                  blockTimestamp
                  transactionHash
              }
          }`,
          variables: { address: address },
        }),
      };

      let dataAddSupply = await axios(configAddSupply);
      for (let item of dataAddSupply.data.data.addSupplies) {
        allData.push({
          type: 'add_supply',
          ...item
        })
      }

      const configWithdrawSupply = {
        method: 'POST',
        url: ConfigService.Subgraph.url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          query: `query withdrawSupplies (
              $address: Bytes!
          ) {
              withdrawSupplies (
                  orderBy: blockTimestamp
                  orderDirection: desc
                  where: {
                      lender: $address
                  }
              ) {
                  lender
                  supply
                  amount
                  blockNumber
                  blockTimestamp
                  transactionHash
              }
          }`,
          variables: { address: address },
        }),
      };

      let dataWithdrawSupply = await axios(configWithdrawSupply);
      for (let item of dataWithdrawSupply.data.data.withdrawSupplies) {
        allData.push({
          type: 'withdraw_supply',
          ...item
        })
      }

      allData.sort((a, b) => b.blockTimestamp - a.blockTimestamp);

      this.cacheManager.store.set(key, allData, ConfigService.Cache.ttl);
      console.log('allData: ', allData);

      history = allData.slice(offset, offset + limit);

      return {
        offset,
        limit,
        total: allData.length,
        history
      };
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
