import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Nepa Bill Api')
  .setDescription('A Product of Xorbious (xorbious.com)')
  .setVersion('1.0')
  .addTag('default')
  .build();
