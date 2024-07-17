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

  async getTransfersHistory(address: string, offset: number, limit: number) {
    try {
      const key = `getTransfersHistory_${address}_${offset}_${limit}`;
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
          query: `query history (
            $offset: Int!
            $limit: Int!
            $address: Bytes!
          ) {
              transfers (
                  skip: $offset
                  first: $limit
                  orderBy: blockNumber
                  orderDirection: desc
                  where: {
                      and: [
                          {
                              or: [
                                  { from: $address }
                                  { to: $address }
                              ]
                          }
                          { value_gt: 0 }
                      ]             
                  }
              ) {
                  id
                  from
                  to
                  value
                  blockNumber
                  blockTimestamp
                  transactionHash
              }
          }`,
          variables: { offset: offset, limit: limit, address: address },
        }),
      };

      const response = await axios(config);
      const data = {
        offset,
        limit,
        history: response.data.data.transfers,
      };

      this.cacheManager.store.set(key, data, ConfigService.Cache.ttl);

      return data;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
