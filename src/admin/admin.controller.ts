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

  @ApiOperation({ summary: 'Add a new collateral token' })
  @Post('collateral')
  async createCollateral(@Body() collateralDto: CollateralDto) {
    try {
      return this.adminService.createCollateral(collateralDto);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Find all collateral tokens' })
  @Get('collateral')
  findAllCollateral() {
    try {
      return this.adminService.findAllCollateral();
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Find a specific collateral token by id' })
  @Get('collateral/:id')
  findCollateral(@Param('id') id: string) {
    try {
      return this.adminService.findCollateral(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Update a collateral token' })
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

  @ApiOperation({ summary: 'Delete a collateral token' })
  @Delete('collateral/:id')
  removeCollateral(@Param('id') id: string) {
    try {
      return this.adminService.removeCollateral(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
