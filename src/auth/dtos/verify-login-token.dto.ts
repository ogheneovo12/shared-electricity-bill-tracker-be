import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyLoginTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}
