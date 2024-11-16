import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PayoutDetailBankwireDto {
  @ApiProperty()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  accountType: string;

  @ApiProperty()
  @IsNotEmpty()
  accountOwner: string;

  @ApiProperty()
  @IsNotEmpty()
  purposeOfPayment: string;

  @ApiProperty()
  @IsNotEmpty()
  sourceOfIncome: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  provider: string;

  @ApiProperty()
  @IsNotEmpty()
  accountOwnerAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  bankAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  bankCountry: string;

  @ApiProperty()
  @IsNotEmpty()
  bicSwift: string;

  @ApiProperty()
  @IsNotEmpty()
  bankCode: string;

  @ApiProperty()
  @IsNotEmpty()
  bankSubcode: string;
}
