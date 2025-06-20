import { Socket } from 'socket.io';
// import { UserInfo } from 'src/user/dto';

export interface SocketWithAuth extends Socket {
  user: any;
}
