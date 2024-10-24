import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CardanoLoanDto {
  @ApiProperty()
  @IsNotEmpty()
  loanTokenName: string;

  @ApiProperty()
  @IsNotEmpty()
  oracleTokenName: string;

  @ApiProperty()
  @IsNotEmpty()
  loanValue: number;

  @ApiProperty()
  @IsNotEmpty()
  userPkh: string;
}
