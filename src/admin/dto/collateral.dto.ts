import { IsNotEmpty, IsEmail, IsIn, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CollateralDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['token', 'native'])
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  chain: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
