import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  last_name: string;

  @IsUrl()
  @IsOptional()
  profile_photo: string;
}

export class AdminEditUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  last_name: string;

  @IsUrl()
  @IsOptional()
  profile_photo: string;
}
