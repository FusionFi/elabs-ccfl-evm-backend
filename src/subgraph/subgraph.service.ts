import { Injectable, Logger, HttpException } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import axios from 'axios';

@Injectable()
export class SubgraphService {
  private readonly logger = new Logger(SubgraphService.name);

  constructor() {}

  async querySubgraph(query: string, variables: string) {
    try {
      let config = {
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
      let response = await axios(config);
      return response.data;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async getTransfersHistory(
    address: string,
    offset: number,
    limit: number,
  ) {
    try {
      let config = {
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
          variables: { "offset": offset, "limit": limit, "address": address },
        }),
      };
      let response = await axios(config);
      return {
        offset,
        limit,
        history: response.data.data.transfers
      }
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
