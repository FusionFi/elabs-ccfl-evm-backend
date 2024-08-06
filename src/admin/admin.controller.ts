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
import { ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Collateral } from './entity/collateral.entity';
import { CollateralDto } from './dto/collateral.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('admin')
@Roles(Role.Admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('collateral')
  async createCollateral(@Body() collateralDto: CollateralDto) {
    try {
      return this.adminService.createCollateral(collateralDto);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Get('collateral')
  findAllCollateral() {
    try {
      return this.adminService.findAllCollateral();
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Get('collateral/:id')
  findCollateral(@Param('id') id: string) {
    try {
      return this.adminService.findCollateral(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

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

  @Delete('collateral/:id')
  removeCollateral(@Param('id') id: string) {
    try {
      return this.adminService.removeCollateral(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
