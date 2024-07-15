import { Controller, Get, HttpException } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('subgraph')
export class SubgraphController {
  constructor() {}

  @Public()
  @Get('healthcheck')
  async getHealthcheck() {
    try {
      return {
        version: "0.0.1"
      }
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
