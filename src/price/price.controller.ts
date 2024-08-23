import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { PriceService } from './price.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';

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
