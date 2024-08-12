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
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CollateralService } from './collateral.service';
import { CollateralDto } from './dto/collateral.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { mapCollateral } from './response-dto/collateral.map';

@ApiTags('collateral')
@Controller('collateral')
export class CollateralController {
  constructor(private readonly collateralService: CollateralService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Add a new collateral' })
  @Post()
  async createCollateral(@Body() collateralDto: CollateralDto) {
    try {
      const newCollateral =
        await this.collateralService.createCollateral(collateralDto);
      return mapCollateral(newCollateral);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find all collaterals' })
  @Get()
  async findAllCollateral(@Query() query: any) {
    try {
      const allCollaterals =
        await this.collateralService.findAllCollateral(query);
      return mapCollateral(allCollaterals);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find a specific collateral by id' })
  @Get(':id')
  async findCollateral(@Param('id') id: string) {
    try {
      const collateral = await this.collateralService.findCollateral(id);
      return mapCollateral(collateral);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update a collateral' })
  @Patch(':id')
  async updateCollateral(
    @Param('id') id: string,
    @Body() collateralDto: CollateralDto,
  ) {
    try {
      const collateral = await this.collateralService.updateCollateral(
        id,
        collateralDto,
      );
      return mapCollateral(collateral);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a collateral' })
  @Delete(':id')
  removeCollateral(@Param('id') id: string) {
    try {
      return this.collateralService.removeCollateral(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
