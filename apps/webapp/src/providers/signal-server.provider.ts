import { InjectionToken, ValueProvider } from '@angular/core';
import { env } from './../envs/env';

export const SIGNAL_SERVER = new InjectionToken<string>('SignalServer');

export class SignalServerProvider {
  private static readonly _defaultValue = env.signalServer;

  static withDefault(): ValueProvider {
    return {
      provide: SIGNAL_SERVER,
      useValue: SignalServerProvider._defaultValue
    };
  }

  static withValue(useValue: string): ValueProvider {
    return {
      provide: SIGNAL_SERVER,
      useValue: useValue,
    }
  }
}
