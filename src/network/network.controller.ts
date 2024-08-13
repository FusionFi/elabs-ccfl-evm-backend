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
import { NetworkService } from './network.service';
import { NetworkDto } from './dto/network.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { mapNetwork } from './response-dto/network.map';

@ApiTags('network')
@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Add a new network' })
  @Post()
  async createNetwork(@Body() networkDto: NetworkDto) {
    try {
      const newNetwork = await this.networkService.createNetwork(networkDto);
      return mapNetwork(newNetwork);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find all networks' })
  @Get()
  async findAllNetwork(@Query() query: any) {
    try {
      const allNetwork = await this.networkService.findAllNetwork(query);
      return mapNetwork(allNetwork);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find a specific network by id' })
  @Get(':id')
  async findNetwork(@Param('id') id: string) {
    try {
      const network = await this.networkService.findNetwork(id);
      return mapNetwork(network);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update a network' })
  @Patch(':id')
  async updateNetwork(@Param('id') id: string, @Body() networkDto: NetworkDto) {
    try {
      const network = await this.networkService.updateNetwork(id, networkDto);
      return mapNetwork(network);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a network' })
  @Delete(':id')
  removeNetwork(@Param('id') id: string) {
    try {
      return this.networkService.removeNetwork(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
