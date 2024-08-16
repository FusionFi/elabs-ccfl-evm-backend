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
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ContractService } from './contract.service';
import { ContractDto } from './dto/contract.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { mapContract } from './response-dto/contract.map';

@ApiTags('contract')
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Add a new contract' })
  @Post()
  async createContract(@Body() contractDto: ContractDto) {
    try {
      const newContract = await this.contractService.createContract(contractDto);
      return mapContract(newContract);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find all contracts' })
  @ApiQuery({
    name: 'type',
    type: String,
    required: false
  })
  @ApiQuery({
    name: 'address',
    type: String,
    required: false
  })
  @ApiQuery({
    name: 'chainId',
    type: Number,
    required: false
  })
  @ApiQuery({
    name: 'asset',
    type: String,
    required: false
  })
  @Get()
  async findAllContract(
    @Query('type') type?: string,
    @Query('address') address?: string,
    @Query('chainId') chainId?: number,
    @Query('asset') asset?: string,
  ) {
    try {
      const allContracts = await this.contractService.findAllContract(type, address, chainId, asset);
      return mapContract(allContracts);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Find a specific contract by id' })
  @Get(':id')
  async findContract(@Param('id') id: string) {
    try {
      const contract = await this.contractService.findContract(id);
      return mapContract(contract);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update a contract' })
  @Patch(':id')
  async updateContract(@Param('id') id: string, @Body() contractDto: ContractDto) {
    try {
      const contract = await this.contractService.updateContract(id, contractDto);
      return mapContract(contract);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a contract' })
  @Delete(':id')
  removeContract(@Param('id') id: string) {
    try {
      return this.contractService.removeContract(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
