import { Controller, Post, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EncryptusService } from './encryptus.service';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('encryptus')
@Controller('encryptus')
export class EncryptusController {
  constructor(private readonly encryptusService: EncryptusService) {}

  @Public()
  @ApiOperation({ summary: 'Generate token' })
  @Post('partners/generate/token')
  async generateToken() {
    try {
      const token = await this.encryptusService.generateToken();
      return token;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
