import { Callback, PeerEvent, PeerEventCallback, PeerEventMap } from './types';
import { SignalMessage } from './interfaces';

export abstract class PeerContact {
  abstract uuid?: string;

  abstract peer: RTCPeerConnection;

  abstract stream: MediaStream;
  abstract remote?: MediaStream;

  abstract readonly events: PeerEventCallback<PeerEvent>;

  public abstract on<K extends keyof PeerEventMap>(
    key: K,
    fn: Callback<PeerEventMap[K]>
  ): void;

  public abstract connect(uuid?: string): void;

  abstract listen(): void;

  abstract gotStream(): (stream: MediaStream) => void;

  abstract setDescription(): (
    value: RTCSessionDescriptionInit
  ) => void;

  abstract errorHandler(error: Event): void;

  abstract getSignalMessage(): (message: SignalMessage) => void;

  abstract getIceCandidate(): (
    event: RTCPeerConnectionIceEvent
  ) => void;
}
