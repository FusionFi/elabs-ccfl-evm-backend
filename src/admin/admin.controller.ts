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
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Collateral } from './entity/collateral.entity';
import { CollateralDto } from './dto/collateral.dto';
import { Supply } from './entity/supply.entity';
import { SupplyDto } from './dto/supply.dto';
import { Setting } from './entity/setting.entity';
import { SettingDto } from './dto/setting.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('admin')
@Roles(Role.Admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Add a new collateral' })
  @Post('collateral')
  async createCollateral(@Body() collateralDto: CollateralDto) {
    try {
      return this.adminService.createCollateral(collateralDto);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Find all collaterals' })
  @Get('collateral')
  findAllCollateral() {
    try {
      return this.adminService.findAllCollateral();
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Find a specific collateral by id' })
  @Get('collateral/:id')
  findCollateral(@Param('id') id: string) {
    try {
      return this.adminService.findCollateral(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Update a collateral' })
  @Patch('collateral/:id')
  updateCollateral(
    @Param('id') id: string,
    @Body() collateralDto: CollateralDto,
  ) {
    try {
      return this.adminService.updateCollateral(id, collateralDto);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Delete a collateral' })
  @Delete('collateral/:id')
  removeCollateral(@Param('id') id: string) {
    try {
      return this.adminService.removeCollateral(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Add a new supply token' })
  @Post('supply')
  async createSupply(@Body() supplyDto: SupplyDto) {
    try {
      return this.adminService.createSupply(supplyDto);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Find all supply tokens' })
  @Get('supply')
  findAllSupply() {
    try {
      return this.adminService.findAllSupply();
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Find a specific supply token by id' })
  @Get('supply/:id')
  findSupply(@Param('id') id: string) {
    try {
      return this.adminService.findSupply(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Update a supply token' })
  @Patch('supply/:id')
  updateSupply(
    @Param('id') id: string,
    @Body() supplyDto: SupplyDto,
  ) {
    try {
      return this.adminService.updateSupply(id, supplyDto);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Delete a supply token' })
  @Delete('supply/:id')
  removeSupply(@Param('id') id: string) {
    try {
      return this.adminService.removeSupply(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Add a new setting' })
  @Post('setting')
  async createSetting(@Body() settingDto: SettingDto) {
    try {
      return this.adminService.createSetting(settingDto);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Find all settings' })
  @Get('setting')
  findAllSetting() {
    try {
      return this.adminService.findAllSetting();
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Find a specific setting by id' })
  @Get('setting/:id')
  findSetting(@Param('id') id: string) {
    try {
      return this.adminService.findSetting(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Update a setting' })
  @Patch('setting/:id')
  updateSetting(
    @Param('id') id: string,
    @Body() settingDto: SettingDto,
  ) {
    try {
      return this.adminService.updateSetting(id, settingDto);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Delete a setting' })
  @Delete('setting/:id')
  removeSetting(@Param('id') id: string) {
    try {
      return this.adminService.removeSetting(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
