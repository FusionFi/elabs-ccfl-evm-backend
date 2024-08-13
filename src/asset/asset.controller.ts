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
import { AssetService } from './asset.service';
import { AssetDto } from './dto/asset.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { mapAsset } from './response-dto/asset.map';

@ApiTags('asset')
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Add a new asset' })
  @Post()
  async createAsset(@Body() assetDto: AssetDto) {
    try {
      const newAsset = await this.assetService.createAsset(assetDto);
      return mapAsset(newAsset);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find all assets' })
  @Get()
  async findAllAsset(@Query() query: any) {
    try {
      const allAssets = await this.assetService.findAllAsset(query);
      return mapAsset(allAssets);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find a specific asset by id' })
  @Get(':id')
  async findAsset(@Param('id') id: string) {
    try {
      const asset = await this.assetService.findAsset(id);
      return mapAsset(asset);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update a asset' })
  @Patch(':id')
  async updateAsset(@Param('id') id: string, @Body() assetDto: AssetDto) {
    try {
      const asset = await this.assetService.updateAsset(id, assetDto);
      return mapAsset(asset);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a asset' })
  @Delete(':id')
  removeAsset(@Param('id') id: string) {
    try {
      return this.assetService.removeAsset(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
