import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { NotFoundError, ServiceError } from 'src/errors';
import { ConflictError } from 'src/errors/conflict.error';
import { SocketWithAuth } from '../types';
import {
  WsBadRequestException,
  WsConflictException,
  WsNotFoundException,
  WsTypeException,
  WsUnauthorizedException,
  WsUnknownException,
} from './ws-exceptions';

@Catch()
export class WsCatchAllFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const socket: SocketWithAuth = host.switchToWs().getClient();
    if (exception instanceof ServiceError) {
      const exceptionMessage = exception.message;
      let wsException = new WsBadRequestException(exceptionMessage);
      if (exception instanceof ConflictError) {
        wsException = new WsConflictException(exceptionMessage);
      } else if (exception instanceof NotFoundError) {
        wsException = new WsNotFoundException(exceptionMessage);
      }
      socket.emit('exception', wsException.getError());
      return;
    }

    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();
      const exceptionMessage =
        exceptionData['message'] ?? exceptionData ?? exception.name;

      const wsException = new WsBadRequestException(exceptionMessage);
      socket.emit('exception', wsException.getError());
      return;
    }

    if (exception instanceof UnauthorizedException) {
      const exceptionData = exception.getResponse();
      const exceptionMessage =
        exceptionData['message'] ?? exceptionData ?? exception.name;
      const wsException = new WsUnauthorizedException(exceptionMessage);
      socket.emit('exception', wsException.getError());
      return;
    }

    if (exception instanceof WsTypeException) {
      socket.emit('exception', exception.getError());
      return;
    }

    const wsException = new WsUnknownException(exception.message);
    socket.emit('exception', wsException.getError());
  }
}
