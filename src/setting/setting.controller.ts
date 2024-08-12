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
import { SettingService } from './setting.service';
import { SettingDto } from './dto/setting.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { mapSetting } from './response-dto/setting.map';

@ApiTags('setting')
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Add a new setting' })
  @Post('setting')
  async createSetting(@Body() settingDto: SettingDto) {
    try {
      const newSetting = await this.settingService.createSetting(settingDto);
      return mapSetting(newSetting);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find all settings' })
  @Get('setting')
  @ApiQuery({
    name: 'key',
    type: String,
    required: false,
  })
  async findAllSetting(@Query('key') key?: string) {
    try {
      const allSetting = await this.settingService.findAllSetting(key);
      return mapSetting(allSetting);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find a specific setting by id' })
  @Get('setting/:id')
  async findSetting(@Param('id') id: string) {
    try {
      const setting = await this.settingService.findSetting(id);
      return mapSetting(setting);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update a setting' })
  @Patch('setting/:id')
  async updateSetting(@Param('id') id: string, @Body() settingDto: SettingDto) {
    try {
      const setting = await this.settingService.updateSetting(id, settingDto);
      return mapSetting(setting);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a setting' })
  @Delete('setting/:id')
  removeSetting(@Param('id') id: string) {
    try {
      return this.settingService.removeSetting(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
