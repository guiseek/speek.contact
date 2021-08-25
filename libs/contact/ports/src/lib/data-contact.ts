import { DataEventCallback } from './types/data-event-callback';
import { DataEventMap } from './types/data-event-map';
import { Callback } from './types';

export abstract class DataContact {
  abstract readonly events: DataEventCallback;

  public abstract on<K extends keyof DataEventMap>(
    key: K,
    fn: Callback<DataEventMap[K]>
  ): void;

  abstract create(
    peer: RTCPeerConnection,
    label: string,
    dataChannelDict?: RTCDataChannelInit
  ): RTCDataChannel;

  abstract sendText(channel: RTCDataChannel, text: string): void;
  abstract sendFile(
    channel: RTCDataChannel,
    text: File | FileList | Blob | Blob[]
  ): void;
}
