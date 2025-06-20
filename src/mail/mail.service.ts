import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialAttachments } from './templates/social-attachments';

@Injectable()
export class MailService {
  private logger: Logger = new Logger('MailService');
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendLoginEmail(email: string, token: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      template: './base',
      subject: "Welcome Dear Neighbour! Here's your access code",
      context: {
        otp: token,
        name,
        content: 'initiate_login',
        title: "Welcome Dear Neighbour! Here's your access code",
      },
      attachments: [...SocialAttachments] as any,
    });
  }
}
