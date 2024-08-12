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
import { SupplyService } from './supply.service';
import { SupplyDto } from './dto/supply.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { mapSupply } from './response-dto/supply.map';

@ApiTags('supply')
@Controller('supply')
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Add a new supply token' })
  @Post()
  async createSupply(@Body() supplyDto: SupplyDto) {
    try {
      const newSupply = await this.supplyService.createSupply(supplyDto);
      return mapSupply(newSupply);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find all supply tokens' })
  @Get()
  async findAllSupply(@Query() query: any) {
    try {
      const allSupply = await this.supplyService.findAllSupply(query);
      return mapSupply(allSupply);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find a specific supply token by id' })
  @Get(':id')
  async findSupply(@Param('id') id: string) {
    try {
      const supply = await this.supplyService.findSupply(id);
      return mapSupply(supply);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update a supply token' })
  @Patch(':id')
  async updateSupply(@Param('id') id: string, @Body() supplyDto: SupplyDto) {
    try {
      const supply = await this.supplyService.updateSupply(id, supplyDto);
      return mapSupply(supply);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a supply token' })
  @Delete(':id')
  removeSupply(@Param('id') id: string) {
    try {
      return this.supplyService.removeSupply(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
