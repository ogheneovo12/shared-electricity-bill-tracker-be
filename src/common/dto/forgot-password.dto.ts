import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class forgotPasswordDto {
  @IsEmail()
  email: string;
}

export class resetPasswordDto {
  @IsStrongPassword()
  password: string;

  @IsString()
  token: string;
}

export class ChangePasswordDto {
  @IsString()
  old_password: string;
}
