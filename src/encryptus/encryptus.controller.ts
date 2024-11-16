import {
  Controller,
  HttpException,
  Get,
  Param,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiExcludeEndpoint,
  ApiQuery,
} from '@nestjs/swagger';
import { EncryptusService } from './encryptus.service';
import { Public } from 'src/common/decorators/public.decorator';
import { EstimateQuoteByAmountDto } from './dto/estimate-quote-by-amount.dto';
import { TransactionStatusDto } from './dto/transaction-status.dto';

@ApiTags('encryptus')
@Controller('encryptus')
export class EncryptusController {
  constructor(private readonly encryptusService: EncryptusService) {}

  @Public()
  @ApiOperation({ summary: 'Get user info via id' })
  @Get('partners/user/:id')
  async getUserInfo(@Param('id') id: string) {
    try {
      const result = await this.encryptusService.getUserInfo(id);
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Generate KYC link for individual' })
  @Get('partners/kycurl/:email')
  async generateKYCLink(@Param('email') email: string) {
    try {
      const result = await this.encryptusService.generateKYCLink(email);
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Get all supported countries and currencies' })
  @Get('partners/supportedCountries')
  async getSupportedCountries() {
    try {
      const result = await this.encryptusService.getSupportedCountries();
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Get all remittance purposes' })
  @Get('setting/remittance-purpose')
  async getSettingRemittancePurpose() {
    try {
      const result = await this.encryptusService.getSettingRemittancePurpose();
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Get all source of funds' })
  @Get('setting/source-of-funds')
  async getSettingSourceOfFunds() {
    try {
      const result = await this.encryptusService.getSettingSourceOfFunds();
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Get all recipient relationship' })
  @Get('setting/recipient-relationship')
  async getSettingRecipientRelationship() {
    try {
      const result =
        await this.encryptusService.getSettingRecipientRelationship();
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Estimate quote by amount' })
  @Post('payout/bankwire/estimatedquotebyamount')
  async estimateQuoteByAmount(
    @Body() estimateQuoteByAmountDto: EstimateQuoteByAmountDto,
  ) {
    try {
      const result = await this.encryptusService.estimateQuoteByAmount(
        estimateQuoteByAmountDto,
      );
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'List all supported banks' })
  @ApiQuery({
    name: 'countryCode',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'currencyCode',
    type: String,
    required: true,
  })
  @Get('payout/bankwire/banklist')
  async getSupportedBanks(
    @Query('countryCode') countryCode: string,
    @Query('currencyCode') currencyCode: string,
  ) {
    try {
      const result = await this.encryptusService.getSupportedBanks(
        countryCode,
        currencyCode,
      );
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'List all submitted transactions' })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'sort',
    type: String,
    required: false,
  })
  @Get('payout/bankwire/transactions')
  async getTransactions(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('sort') sort: string,
  ) {
    try {
      const result = await this.encryptusService.getTransactions(
        limit,
        page,
        sort,
      );
      return result;
    } catch (e) {
      console.log('error: ', e);
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Get fx rate' })
  @ApiQuery({
    name: 'receivingCurrency',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'receivingCountry',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'transferType',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'coin',
    type: String,
    required: true,
  })
  @Get('payout/bankwire/fxrate')
  async getRate(
    @Query('receivingCurrency') receivingCurrency: string,
    @Query('receivingCountry') receivingCountry: string,
    @Query('transferType') transferType: string,
    @Query('coin') coin: string,
  ) {
    try {
      const result = await this.encryptusService.getRate(
        receivingCurrency,
        receivingCountry,
        transferType,
        coin,
      );
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Update transaction status' })
  @Post('transaction/update-status')
  async updateTransactionStatus(
    @Body() transactionStatusDto: TransactionStatusDto,
  ) {
    try {
      const result =
        await this.encryptusService.updateTransactionStatus(
          transactionStatusDto,
        );
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
