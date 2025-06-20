import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import Queues from 'src/common/constants/queues.constants';
import { QueueConnection } from 'src/common/processors/worker-host.processor';
import { EmailProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          port: 465,
          host: config.get('MAIL_HOST'),
          secure: true,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"NEPA!" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, '..', 'mail', 'templates'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            options: { strict: true },
            dir: join(__dirname, '..', 'mail', 'templates'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    QueueConnection(Queues.SendMail),
  ],
  providers: [MailService, EmailProcessor],
  exports: [MailService, EmailProcessor], // 👈 export for DI
})
export class MailModule {}
