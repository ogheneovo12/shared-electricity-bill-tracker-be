import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const contextType = context.getType();
    if (contextType === 'ws') {
      const socket = context.switchToWs().getClient();

      const token =
        socket.handshake.auth.access_token ||
        socket.handshake.headers['access_token'];

      socket.headers = socket.headers || {};
      socket.headers.authorization = token;

      return socket;
    }
    return context.switchToHttp().getRequest();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
