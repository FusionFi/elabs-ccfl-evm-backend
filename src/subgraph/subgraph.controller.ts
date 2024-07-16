import {
  Controller,
  Get,
  HttpException,
  Post,
  Body,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SubgraphService } from './subgraph.service';
import { QueryDto } from './dto/query.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { IntDefaultValuePipe } from 'src/common/pipes/int-default-value.pipe';

@Controller('subgraph')
export class SubgraphController {
  constructor(private subgraphService: SubgraphService) {}

  @Public()
  @Get('healthcheck')
  async getHealthcheck() {
    try {
      return {
        version: '0.0.1',
      };
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('query')
  async querySubgraph(@Body() queryDto: QueryDto) {
    try {
      let response = await this.subgraphService.querySubgraph(
        queryDto.query,
        queryDto.variables,
      );
      return response;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @Get('transfers/:address/history')
  async getTransfersHistory(
    @Param('address') address: string,
    @Query('offset', new IntDefaultValuePipe(0)) offset: number,
    @Query('limit', new IntDefaultValuePipe(10)) limit: number,
  ) {
    try {
      let data = await this.subgraphService.getTransfersHistory(
        address,
        offset,
        limit,
      );
      return data;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
