import {
  IsNotEmpty,
  IsEmail,
  IsIn,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NetworkDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  chainId: string;

  @ApiProperty()
  @IsNotEmpty()
  txUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  rpcUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isMainnet: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
