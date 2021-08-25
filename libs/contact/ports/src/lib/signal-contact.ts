import { SignalMessage } from './interfaces';
import { Callback } from './types';

export interface Socket {
  on<T>(evt: string, fn: Callback<T>): void;
  emit<T>(evt: string, message: T): void;
}

export abstract class SignalContact<T extends Socket> {
  abstract connection: T;

  abstract on(event: string, fn: (message: SignalMessage) => void): void;

  abstract emit<T>(event: string, message: T): void;
}
