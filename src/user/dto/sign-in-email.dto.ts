import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Wrong email format' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
