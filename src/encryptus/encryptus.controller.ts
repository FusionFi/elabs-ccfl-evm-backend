import {
  Controller,
  HttpException,
  Get,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EncryptusService } from './encryptus.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('encryptus')
@Controller('encryptus')
export class EncryptusController {
  constructor(private readonly encryptusService: EncryptusService) {}

  @Public()
  @ApiOperation({ summary: 'Create a new user on Encryptus' })
  @Post('partners/create/user')
  async createNewUser(@Body() { email }: CreateUserDto) {
    try {
      const result = await this.encryptusService.createNewUser(email);
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

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
  @Get('partners/kycurl')
  async generateKYCLink() {
    try {
      const result = await this.encryptusService.generateKYCLink();
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Get all supported countries' })
  @Get('payout/bankwire/supportedcountries')
  async getAllSupportedCountries() {
    try {
      const result = await this.encryptusService.getAllSupportedCountries();
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Get all supported currencies' })
  @Get('payout/bankwire/supportedcurrencies')
  async getAllSupportedCurrencies() {
    try {
      const result = await this.encryptusService.getAllSupportedCurrencies();
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
