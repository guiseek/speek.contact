import { FactoryProvider, InjectionToken, ValueProvider } from '@angular/core';
import { SignalingImpl } from '@speek/common-adapters';
import { Signaling } from '@speek/common-definitions';
import { env } from './../envs/env';

export const SIGNALING_URL = new InjectionToken<string>('Signaling');

export class SignalingProvider {
  static withDefault(): [ValueProvider, FactoryProvider] {
    return [
      {
        provide: SIGNALING_URL,
        useValue: env.signaling,
      },
      {
        provide: Signaling,
        useFactory: (host: string) => {
          return new SignalingImpl(host);
        },
        deps: [SIGNALING_URL],
      },
    ];
  }

  static withValue(signalingUrl: string): [ValueProvider, FactoryProvider] {
    return [
      {
        provide: SIGNALING_URL,
        useValue: signalingUrl,
      },
      {
        provide: Signaling,
        useFactory: (host: string) => {
          return new SignalingImpl(host);
        },
        deps: [SIGNALING_URL],
      },
    ];
  }
}
