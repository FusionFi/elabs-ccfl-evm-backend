import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Wrong email format' })
  email: string;
}
