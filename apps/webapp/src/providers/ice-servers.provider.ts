import { InjectionToken, ValueProvider } from '@angular/core';
import { env } from './../envs/env';

export const ICE_SERVERS = new InjectionToken<string>('IceServers');

export class IceServersProvider {
  private static readonly _defaultValue = env.iceServers;

  static withDefault(): ValueProvider {
    return {
      provide: ICE_SERVERS,
      useValue: IceServersProvider._defaultValue
    };
  }

  static withValue(useValue: RTCIceServer[]): ValueProvider {
    return {
      provide: ICE_SERVERS,
      useValue: useValue,
    }
  }
}
