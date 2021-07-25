import { FactoryProvider, InjectionToken, ValueProvider } from '@angular/core';
import { SignalingImpl } from '@speek/common-adapters';
import { Signaling } from '@speek/common-definitions';
import { env } from './../envs/env';

export const SIGNAL_SERVER = new InjectionToken<string>('SignalServer');

function buildProviders(useValue: string): [ValueProvider, FactoryProvider] {
  return [
    {
      provide: SIGNAL_SERVER,
      useValue: useValue,
    },
    {
      provide: Signaling,
      useFactory: (host: string) => {
        return new SignalingImpl(host);
      },
      deps: [SIGNAL_SERVER],
    },
  ];
}

export class SignalServerProvider {
  static withDefault() {
    return buildProviders(env.signalServer);
  }

  static withValue(useValue: string) {
    return buildProviders(useValue);
  }
}
