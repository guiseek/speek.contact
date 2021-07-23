import { SignalingEvent, SignalingEventMap, SignalingMessage } from '@speek/common-definitions';
import { Socket, io } from 'socket.io-client';
import { Injectable } from '@angular/core';
import { AppConfig } from './app.config';


@Injectable()
export class AppSignaling {
  private client: Socket;

  public id!: string;

  constructor(readonly config: AppConfig) {
    this.client = io(this.config.server);
    this.on(SignalingEvent.Connection, ({ id }) => {
      if (!!this.id === false) {
        console.log(id);
        this.id = id;
      }
    })
  }

  on<K extends keyof SignalingEventMap>(
    key: K,
    fn: (value: SignalingMessage<K, SignalingEventMap[K]>) => void
  ) {
    this.client.on<keyof SignalingEventMap>(key, fn);
  }

  send<K extends keyof SignalingEventMap>(
    key: K,
    value: SignalingEventMap[K]
  ) {
    this.client.emit(key, { id: this.id, [key]: value });
  }
}
