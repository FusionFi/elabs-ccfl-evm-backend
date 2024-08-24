import { IsNotEmpty, IsIn, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssetDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['supply', 'collateral'])
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['native', 'token'])
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  chainName: string;

  @ApiProperty()
  @IsNotEmpty()
  chainId: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  decimals: number;

  @ApiProperty()
  @IsNotEmpty()
  coingeckoId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isMainnet: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
