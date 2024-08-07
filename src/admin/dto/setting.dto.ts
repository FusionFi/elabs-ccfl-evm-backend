import { IsNotEmpty, IsEmail, IsIn, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SettingDto {
  @ApiProperty()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  value: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['number', 'string', 'json'])
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
