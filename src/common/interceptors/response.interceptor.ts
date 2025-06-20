import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const contextType = context.getType<'http' | 'stripe_webhook'>();

    // Do nothing if this is a Stripe webhook event
    if (contextType === 'stripe_webhook') {
      return next.handle();
    }
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) => {
        return throwError(() => this.errorHandler(err, context));
      }),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const error = exception?.getResponse
      ? exception?.getResponse()
      : exception.message;

    const getErrorMessage = () => {
      if (typeof error === 'string') return error;
      return (error as any)?.message;
    };

    this.logger.error(
      `Error caught in interceptor: ${exception.message} ${getErrorMessage()}`,
    );

    response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message: exception.message,
      error,
    });
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode = response.statusCode;

    return {
      status: true,
      path: request.url,
      statusCode,
      data: res,
    };
  }
}
