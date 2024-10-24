import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OracleDataDto {
  @ApiProperty()
  @IsNotEmpty()
  oracleTokenName: string;

  @ApiProperty()
  @IsNotEmpty()
  currency: string;
}
