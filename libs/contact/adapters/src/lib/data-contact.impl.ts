import { Callback, DataContact } from '@speek/contact/ports';
import { DataEventCallback } from 'libs/contact/ports/src/lib/types/data-event-callback';
import { DataEventMap } from 'libs/contact/ports/src/lib/types/data-event-map';

export class DataContactImpl implements DataContact {
  events: DataEventCallback<keyof DataEventMap>;

  constructor() {
    this.events = new Map();
  }

  public on<K extends keyof DataEventMap>(
    key: K,
    fn: Callback<DataEventMap[K]>
  ): void {
    this.events.set(key, fn as () => void);
  }

  create(
    peer: RTCPeerConnection,
    label: string,
    dataChannelDict?: RTCDataChannelInit
  ): RTCDataChannel {
    const channel = peer.createDataChannel(label, dataChannelDict);
    channel.onmessage = () => {};
    return channel;
  }

  sendText(channel: RTCDataChannel, text: string): void {
    channel.send(text);
  }
  sendFile(channel: RTCDataChannel, file: File | Blob): void {
    if (file.size === 0) {
      // closeDataChannels();
      return;
    }

    let sendProgress = { value: 0, min: 0, max: 0 };
    let receiveProgress = { value: 0, min: 0, max: 0 };

    let offset = 0;
    sendProgress.max = file.size;
    receiveProgress.max = file.size;

    const chunkSize = 16384;
    let fileReader = new FileReader();

    fileReader.onload = () => {
      const result = fileReader.result as ArrayBuffer;
      channel.send(result);
      offset += result.byteLength;
      sendProgress.value = offset;
      if (offset < file.size) {
        readSlice(offset);
      }
    };

    channel.onbufferedamountlow = (e) => {
      console.log(e);
    };

    const readSlice = (o: number) => {
      console.log('readSlice ', o);
      const slice = file.slice(offset, o + chunkSize);
      fileReader.readAsArrayBuffer(slice);
    };

    readSlice(0);

    if (fileReader && fileReader.readyState === 1) {
      console.log('Abort read!');
      fileReader.abort();
    }
  }
}
