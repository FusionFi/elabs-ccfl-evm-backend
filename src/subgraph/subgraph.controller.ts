import { Controller, Get, HttpException, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SubgraphService } from './subgraph.service';
import { QueryDto } from './dto/query.dto';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('subgraph')
export class SubgraphController {
  constructor(private subgraphService: SubgraphService) {}

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

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('query')
  async querySubgraph(@Body() queryDto: QueryDto) {
    try {
      let response = await this.subgraphService.querySubgraph(queryDto.query, queryDto.variables);
      return response;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
