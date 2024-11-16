import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  encryptus_order_id: string;

  @ApiProperty()
  @IsNotEmpty()
  transaction_status: string;
}
