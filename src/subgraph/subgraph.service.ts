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
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          query: query,
          variables: variables
        })
      }
      let response = await axios(config);
      return response.data;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
