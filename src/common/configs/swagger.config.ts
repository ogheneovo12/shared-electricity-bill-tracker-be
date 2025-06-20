import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('ALT HUB TEAM 23')
  .setDescription('A Product of ALTHUB Technologies')
  .setVersion('1.0')
  .addTag('default')
  .build();
