import { ContactEventMap } from "../types/contact-event-map";
import { ContactMessage } from "../types/contact-message";

export abstract class Contact {
  abstract client: any;

  abstract id: string;

  abstract on<K extends keyof ContactEventMap>(
    key: K,
    fn: (value: ContactMessage<K, ContactEventMap[K]>) => void
  ): void;

  abstract send<K extends keyof ContactEventMap>(
    key: K,
    value: ContactEventMap[K]
  ): void;
}
