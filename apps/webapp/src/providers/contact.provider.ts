import { FactoryProvider, InjectionToken, ValueProvider } from '@angular/core';
import { ContactImpl, Http } from '@speek/common-adapters';
import { Contact } from '@speek/common-definitions';
import { HttpClient } from '@angular/common/http';

export const SIGNALING_URL = new InjectionToken<string>('Contact');

export class ContactProvider {
  static withDefault(): [ValueProvider, FactoryProvider] {
    return [
      {
        provide: Http,
        useValue: HttpClient,
      },
      {
        provide: Contact,
        useFactory: (client: HttpClient) => {
          return new ContactImpl(client);
        },
        deps: [Http],
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
        provide: Contact,
        useFactory: (host: HttpClient) => {
          return new ContactImpl(host);
        },
        deps: [SIGNALING_URL],
      },
    ];
  }
}
