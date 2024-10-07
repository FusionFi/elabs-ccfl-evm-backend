import { Controller, HttpException, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EncryptusService } from './encryptus.service';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('encryptus')
@Controller('encryptus')
export class EncryptusController {
  constructor(private readonly encryptusService: EncryptusService) {}

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
}
