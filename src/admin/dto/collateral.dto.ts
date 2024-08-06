import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CollateralDto {
  @ApiProperty()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  chain: string;

  @ApiProperty()
  @IsNotEmpty()
  isActive: boolean;
}
