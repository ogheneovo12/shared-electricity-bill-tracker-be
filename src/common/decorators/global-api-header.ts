import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiHeaderOptions, ApiHeaders } from '@nestjs/swagger';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function GlobalApiHeader(
  options: ApiHeaderOptions | ApiHeaderOptions[],
) {
  return applyDecorators(
    Array.isArray(options) ? ApiHeaders(options) : ApiHeader(options),
  );
}

export const HeaderParam = (headerName: string) => {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers[headerName.toLowerCase()]; // HTTP headers are case-insensitive
  })();
};
