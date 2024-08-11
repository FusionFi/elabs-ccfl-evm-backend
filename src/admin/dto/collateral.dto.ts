import {
  IsNotEmpty,
  IsEmail,
  IsIn,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CollateralDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['token', 'native'])
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  chain: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsOptional()
  decimals: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isMainnet: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
