import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class InitiateLoginDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
