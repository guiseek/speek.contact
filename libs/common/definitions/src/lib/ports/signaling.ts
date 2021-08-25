import { SignalingEventMap } from "../types/signaling-event-map";
import { SignalingMessage } from "../types/signaling-message";

export abstract class Signaling {
  abstract client: any;

  abstract id: string;

  abstract on<K extends keyof SignalingEventMap>(
    key: K,
    fn: (value: SignalingMessage<SignalingEventMap[K]>) => void
  ): void;

  abstract send<K extends keyof SignalingEventMap>(
    key: K,
    value: SignalingEventMap[K]
  ): void;
}
