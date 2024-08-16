import { IsNotEmpty, IsIn, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContractDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['ccfl', 'pool'])
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  chainId: number;

  @ApiProperty()
  @IsOptional()
  asset: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
