import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryDto {
  @ApiProperty()
  @IsNotEmpty()
  query: string;

  @ApiProperty()
  @IsNotEmpty()
  variables: string;
}
