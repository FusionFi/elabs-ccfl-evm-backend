import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CardanoService } from './cardano.service';
import { CardanoLoanDto } from './dto/cardano-loan.dto';
import { OracleDataDto } from './dto/oracle-data.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { mapCardanoLoan } from './response-dto/cardano-loan.map';
import { mapOracleData } from './response-dto/oracle-data.map';

@ApiTags('cardano')
@Controller('cardano')
export class CardanoController {
  constructor(private readonly cardanoService: CardanoService) {}

  @Public()
  @ApiOperation({ summary: 'Create a new Cardano loan' })
  @Post('loan/create')
  async createCardanoLoan(@Body() cardanoLoanDto: CardanoLoanDto) {
    try {
      const result =
        await this.cardanoService.createCardanoLoan(cardanoLoanDto);
      return mapCardanoLoan(result);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find all Cardano loans' })
  @ApiQuery({
    name: 'loanTokenName',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'oracleTokenName',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'userPkh',
    type: String,
    required: false,
  })
  @Get('loan/all')
  async findAllCardanoLoan(
    @Query('loanTokenName') loanTokenName?: string,
    @Query('oracleTokenName') oracleTokenName?: string,
    @Query('userPkh') userPkh?: string,
  ) {
    try {
      const result = await this.cardanoService.findAllCardanoLoan(
        loanTokenName,
        oracleTokenName,
        userPkh,
      );
      return mapCardanoLoan(result);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Create a new oracle data' })
  @Post('oracle/data/create')
  async createOracleData(@Body() oracleDataDto: OracleDataDto) {
    try {
      const result = await this.cardanoService.createOracleData(oracleDataDto);
      return mapOracleData(result);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find all oracle data' })
  @ApiQuery({
    name: 'oracleTokenName',
    type: String,
    required: false,
  })
  @Get('oracle/data/all')
  async findAllOracleData(@Query('oracleTokenName') oracleTokenName?: string) {
    try {
      const result =
        await this.cardanoService.findAllOracleData(oracleTokenName);
      return mapOracleData(result);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
