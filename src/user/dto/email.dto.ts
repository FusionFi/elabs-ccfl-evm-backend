import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty()
  email: string;
}
