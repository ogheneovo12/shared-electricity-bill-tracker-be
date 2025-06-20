import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessTokenGuard } from './auth/guards';

@UseGuards(AccessTokenGuard)
@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  greet() {
    return 'Heeloo';
  }
}
