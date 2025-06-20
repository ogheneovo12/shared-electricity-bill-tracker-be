import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { Queue } from 'bullmq';
import { generateToken } from 'src/common';
import Queues from 'src/common/constants/queues.constants';
import { MailService } from 'src/mail/mail.service';
import { UserDocument } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @InjectQueue(Queues.SendMail) private readonly emailQueue: Queue,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  private logger = new Logger('AUTHSERVICE');

  async validateUser(sub: string) {
    const user = await this.usersService.findById(sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  async initiateLogin(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return; // Don't reveal if user exists

    const tempToken = generateToken();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.tempLoginToken = tempToken;
    user.tempLoginTokenExpiry = expiry;

    await user.save();

    // Implement your email sending logic here
    await this.sendLoginEmail(user.email, tempToken, user.first_name);
  }

  async verifyTempToken(token: string): Promise<{
    user: UserDocument;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.usersService.findByTempToken(token);

    if (
      !user ||
      !user.tempLoginTokenExpiry ||
      user.tempLoginTokenExpiry < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Clear temporary token
    user.tempLoginToken = null;
    user.tempLoginTokenExpiry = null;

    await user.save();

    const tokens = await this.generateTokens(user);

    return { user, ...tokens };
  }

  private async generateTokens(user: UserDocument) {
    const payload = {
      sub: user._id,
      email: user.email,
      is_admin: user.is_admin,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.configService.get<string>('JWT_ACCESS_SECRET', ''),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', ''),
    });

    // Store hashed refresh token
    const hashedRefreshToken = await argon.hash(refreshToken);

    user.refreshTokenHash = hashedRefreshToken;

    await user.save();

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(
    refreshToken: string,
    sub: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify the refresh token

      // Find user by ID in payload
      const user = await this.usersService.findById(sub);

      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify the refresh token matches the stored hash
      const isValid = await argon.verify(user.refreshTokenHash, refreshToken);
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens and update refresh token hash
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async sendLoginEmail(email: string, token: string, name: string) {
    try {
      await this.mailService.sendLoginEmail(email, token, name);
    } catch (err) {
      this.logger.log(`EMAIL SENT TO ${email} failed`);
      this.logger.log(err, 'REASON');
    }
  }
}
