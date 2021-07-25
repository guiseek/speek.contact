import { SignalingEventMap, SignalingMessage } from '@speek/common-definitions';
import { SIGNAL_SERVER } from './../providers/signal-server.provider';
import { Inject, Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';

@Injectable()
export class AppSignaling {
  private client: Socket;

  public id = '';

  constructor(
    @Inject(SIGNAL_SERVER)
    readonly host: string
  ) {
    this.client = io(host);

    this.on('connection', ({ id }) => {
      if (this.id === '') this.id = id;
    });
  }

  on<K extends keyof SignalingEventMap>(
    key: K,
    fn: (value: SignalingMessage<K, SignalingEventMap[K]>) => void
  ) {
    this.client.on<keyof SignalingEventMap>(key, fn);
  }

  send<K extends keyof SignalingEventMap>(key: K, value: SignalingEventMap[K]) {
    this.client.emit(key, { id: this.id, [key]: value });
  }
}
