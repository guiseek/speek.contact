import { PeerEventCallback, PeerEvent, PeerEventMap, Callback } from './types';
import { PeerContact } from './peer-contact';

class PeerContactImpl implements PeerContact {
  uuid: string;

  peer: RTCPeerConnection;

  stream: MediaStream;

  events: PeerEventCallback<PeerEvent>;

  constructor() {
    this.events = new Map();
  }

  on<K extends keyof PeerEventMap>(
    key: K,
    fn: Callback<PeerEventMap[K]>
  ): void {
    throw new Error('Method not implemented.');
  }

  public connect(uuid: string): void {
    throw new Error('Method not implemented.');
  }

  listen(): void {
    throw new Error('Method not implemented.');
  }

  signaling(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  gotStream(): (stream: MediaStream) => void {
    throw new Error('Method not implemented.');
  }

  setDescription(): (value: RTCSessionDescriptionInit) => void {
    throw new Error('Method not implemented.');
  }

  errorHandler(error: Event): void {
    throw new Error('Method not implemented.');
  }

  getSignalMessage(): (message: {
    sdp: RTCSessionDescription;
    ice: RTCIceCandidate;
    uuid: string;
  }) => void {
    throw new Error('Method not implemented.');
  }

  getIceCandidate(): (event: RTCPeerConnectionIceEvent) => void {
    throw new Error('Method not implemented.');
  }
}

describe('PeerContact', () => {
  let contact: PeerContactImpl;

  beforeAll(() => {
    contact = new PeerContactImpl();
  });

  it('should work', () => {
    expect(contact).toBeDefined();
  });
});
