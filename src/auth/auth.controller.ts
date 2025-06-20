import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InitiateLoginDto } from './dtos/initiate-login.dto';
import { VerifyLoginTokenDto } from './dtos/verify-login-token.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';
import { Request } from 'express';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { UserDocument } from 'src/user/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('initiate-login')
  async initiateLogin(@Body() body: InitiateLoginDto) {
    await this.authService.initiateLogin(body.email);
    return { message: 'If the email exists, a login token has been sent' };
  }

  @Post('verify-login-token')
  async verifyToken(@Body() dto: VerifyLoginTokenDto) {
    return this.authService.verifyTempToken(dto.token);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    return this.authService.refreshAccessToken(
      dto.refresh_token,
      req?.user?.['sub'],
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('/me')
  myProfile(@GetUser() user: UserDocument) {
    return user;
  }
}
