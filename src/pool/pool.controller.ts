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
import { PoolService } from './pool.service';
// import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('pool')
@Controller('pool')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Public()
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Find all pools' })
  @Get('all/:chainId')
  async getAllPool(@Param('chainId') chainId: number) {
    try {
      const allPools = await this.poolService.getAllPool(chainId);
      return allPools;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
