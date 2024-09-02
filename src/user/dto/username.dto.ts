import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UsernameDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
}
