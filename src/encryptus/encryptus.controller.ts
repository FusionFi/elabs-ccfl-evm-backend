import { Controller, Post, HttpException, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EncryptusService } from './encryptus.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('encryptus')
@Controller('encryptus')
export class EncryptusController {
  constructor(private readonly encryptusService: EncryptusService) {}

  @Public()
  @ApiOperation({ summary: 'Create a new user to onramp/offramp' })
  @Post('partners/create/user')
  async createUser(@Body() { email }: CreateUserDto) {
    try {
      const result = await this.encryptusService.createUser(email);
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
