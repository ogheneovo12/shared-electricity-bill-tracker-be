import { WsException } from '@nestjs/websockets';

type WsExceptionType =
  | 'BadRequest'
  | 'Unauthorized'
  | 'Conflict'
  | 'NotFound'
  | 'Unknown';

export class WsTypeException extends WsException {
  readonly type: WsExceptionType;

  constructor(type: WsExceptionType, message: string) {
    const error = {
      type,
      message,
    };
    super(error);
    this.type = type;
  }
}

export class WsBadRequestException extends WsTypeException {
  constructor(message: string) {
    super('BadRequest', message);
  }
}

export class WsConflictException extends WsTypeException {
  constructor(message: string) {
    super('Conflict', message);
  }
}

export class WsNotFoundException extends WsTypeException {
  constructor(message: string) {
    super('NotFound', message);
  }
}

export class WsUnauthorizedException extends WsTypeException {
  constructor(message: string) {
    super('Unauthorized', message);
  }
}

export class WsUnknownException extends WsTypeException {
  constructor(message: string) {
    super('Unknown', message);
  }
}
