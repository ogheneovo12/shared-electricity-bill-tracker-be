import { SetMetadata } from '@nestjs/common';

export const AccessParam = (options: {
  bodyField?: string;
  queryField?: string;
  paramField?: string;
}) => SetMetadata('access-param', options);
