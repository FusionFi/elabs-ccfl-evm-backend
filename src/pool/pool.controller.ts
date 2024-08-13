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
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { PoolService } from './pool.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';

@ApiTags('pool')
@Controller('pool')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Public()
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Find all pools' })
  @Get('all')
  async findAllPool(@Query() network?: string) {
    try {
      const fakeData = [
        {
          asset: 'USDC',
          loan_available: '10000',
          apr: '0.07',
        },
        {
          asset: 'USDT',
          loan_available: '10000',
          apr: '0.07',
        },
      ];
      return fakeData;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
