import { Signaling, SignalingEventMap, SignalingMessage } from '@speek/common-definitions';
import { Socket, io } from 'socket.io-client';

export class SignalingImpl implements Signaling {
  client: Socket;

  public id = '';

  constructor(readonly host: string) {
    this.client = io(host);

    this.on('connection', ({ id }) => {
      if (this.id === '') this.id = id;
    });
  }

  on<K extends keyof SignalingEventMap>(
    key: K,
    fn: (value: SignalingMessage<SignalingEventMap[K]>) => void
  ) {
    this.client.on<keyof SignalingEventMap>(key, fn);
  }

  send<K extends keyof SignalingEventMap>(key: K, value: SignalingEventMap[K]) {
    this.client.emit(key, { id: this.id, data: value });
  }
}
