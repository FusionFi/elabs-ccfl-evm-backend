import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Collateral } from './entity/collateral.entity';
import { CollateralDto } from './dto/collateral.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('collateral')
  async createCollateral(@Body() collateralDto: CollateralDto) {
    return this.adminService.createCollateral(collateralDto);
  }

  @Get('collateral')
  findAllCollateral() {
    return this.adminService.findAllCollateral();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.adminService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
  //   return this.adminService.update(+id, updateAdminDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.adminService.remove(+id);
  // }
}
