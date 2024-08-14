import { IsNotEmpty, IsBoolean } from 'class-validator';
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
  chainId: number;

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
