import { Controller, Get, Param, HttpException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FiatService } from './fiat.service';
import { Public } from 'src/common/decorators/public.decorator';
import { mapFiat } from './response-dto/fiat.map';

@ApiTags('fiat')
@Controller('fiat')
export class FiatController {
  constructor(private readonly fiatService: FiatService) {}

  @Public()
  @ApiOperation({ summary: 'Find all fiat prices' })
  @ApiQuery({
    name: 'currency',
    type: String,
    required: false,
  })
  @Get('price')
  async findAllFiatPrice(@Query('currency') currency?: string) {
    try {
      const allFiat = await this.fiatService.findAllFiatPrice(currency);
      return mapFiat(allFiat);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find fiat price' })
  @Get('price/:currency')
  async findFiatPrice(@Param('currency') currency: string) {
    try {
      const fiat = await this.fiatService.findFiatPrice(currency);
      return mapFiat(fiat);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
