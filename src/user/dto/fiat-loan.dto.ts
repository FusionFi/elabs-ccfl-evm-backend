import { IsNotEmpty, IsObject, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FiatLoanDto {
  @ApiProperty()
  @IsNotEmpty()
  userEncryptusId: string;

  @ApiProperty()
  @IsNotEmpty()
  userWalletAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  networkId: number;

  @ApiProperty()
  @IsNotEmpty()
  txHash: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['BANK_WIRE', 'GIFT_CODE'])
  payoutMethod: string;

  @ApiProperty()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  currency: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['USDC', 'USDT'], {
    message: 'repayment token must be either USDC or USDT',
  })
  repaymentToken: string;

  @ApiProperty()
  @IsObject()
  payoutDetail: object;

  @ApiProperty()
  @IsNotEmpty()
  isReceiveEmail: boolean;
}
