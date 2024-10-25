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
}
