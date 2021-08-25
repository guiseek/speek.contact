import { SignalContact, SignalMessage } from '@speek/contact/ports';
import { io, Socket } from 'socket.io-client';

export class SignalContactImpl implements SignalContact<Socket> {
  connection: Socket;

  constructor(readonly signalingServer: string) {
    this.connection = io(signalingServer);
  }

  on(event: string, fn: (message: SignalMessage) => void) {
    this.connection.on(event, fn);
  }

  emit<T>(event: string, message: T) {
    this.connection.emit(event, message);
  }
}
