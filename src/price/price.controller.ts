import {
  Controller,
  Get,
  Param,
  HttpException,
  // UseGuards,
} from '@nestjs/common';
import {
  // ApiBearerAuth,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { PriceService } from './price.service';
// import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('price')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Public()
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get asset price' })
  @Get(':chainId/:asset')
  async getPrice(
    @Param('chainId') chainId: number,
    @Param('asset') asset: string,
  ) {
    try {
      const price = await this.priceService.getPrice(chainId, asset);
      return price;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
