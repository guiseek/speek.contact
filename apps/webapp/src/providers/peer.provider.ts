import { env } from '@speek/envs/webapp';
import { InjectionToken, ValueProvider, FactoryProvider } from '@angular/core';
import { Peer } from '@speek/common-definitions';
import { PeerImpl } from '@speek/common-adapters';

export const PEER_PROVIDER = new InjectionToken<Peer>('Peer');


export class PeerProvider {
  static withDefault(): [ValueProvider, FactoryProvider] {
    return [
      {
        provide: PEER_PROVIDER,
        useValue: env.iceServers
      },
      {
        provide: Peer,
        useFactory: (iceServers: RTCIceServer[]) => new PeerImpl(iceServers),
        deps: [PEER_PROVIDER]
      }
    ];
  }

  static withConfig(iceServers: RTCIceServer[]): [ValueProvider, FactoryProvider] {
    return [
      {
        provide: PEER_PROVIDER,
        useValue: iceServers
      },
      {
        provide: Peer,
        useFactory: (iceServers: RTCIceServer[]) => new PeerImpl(iceServers),
        deps: [PEER_PROVIDER]
      }
    ];
  }
}
