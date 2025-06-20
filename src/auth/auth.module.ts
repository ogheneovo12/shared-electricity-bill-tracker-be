import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { QueueConnection } from 'src/common/processors/worker-host.processor';
import Queues from 'src/common/constants/queues.constants';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET', ''),
        signOptions: { expiresIn: '5m' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    QueueConnection(Queues.SendMail),
  ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
