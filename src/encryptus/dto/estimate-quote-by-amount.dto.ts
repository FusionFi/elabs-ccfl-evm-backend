import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EstimateQuoteByAmountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['USDC', 'USDT'], { message: 'coin must be either USDC or USDT' })
  coin: string;

  @ApiProperty({ default: 'BANK' })
  @IsNotEmpty()
  transferType: string;

  @ApiProperty()
  @IsNotEmpty()
  sendingCurrency: string;

  @ApiProperty()
  @IsNotEmpty()
  sendingCountry: string;

  @ApiProperty()
  @IsNotEmpty()
  receivingCurrency: string;

  @ApiProperty()
  @IsNotEmpty()
  receivingCountry: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;
}
