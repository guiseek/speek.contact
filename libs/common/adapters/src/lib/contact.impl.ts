import { Observable } from 'rxjs';
import {
  Contact,
  ContactEventMap,
  ContactMessage,
  ObjectId,
} from '@speek/common-definitions';

export abstract class Http {
  abstract post<R, D>(url: string, data: D): Observable<R>;
}

export class ContactImpl implements Contact {
  // client: any;
  id: string = '';

  eventSource = new EventSource('/gateway/ping');

  constructor(readonly client: Http) {}

  on<K extends keyof ContactEventMap>(
    key: K,
    fn: (value: ContactMessage<K, ContactEventMap[K]>) => void
  ): void {
    this.eventSource.onmessage = ({ data }: MessageEvent<ObjectId>) => {
      this.id = data.id;
      console.log(data);
    }
  }

  send<K extends keyof ContactEventMap>(
    key: K,
    value: ContactEventMap[K]
  ): void {
    this.client.post('/gateway/contact', { [key]: value });
  }
}
