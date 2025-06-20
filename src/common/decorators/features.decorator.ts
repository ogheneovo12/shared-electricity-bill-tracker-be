import { SetMetadata } from '@nestjs/common';

export const FeatureParam = (options: {
  bodyField?: string;
  queryField?: string;
  paramField?: string;
}) => SetMetadata('access-param', options);
