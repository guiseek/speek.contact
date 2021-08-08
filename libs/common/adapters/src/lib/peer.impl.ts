import {
  Peer,
  Callback,
  PeerEvent,
  PeerEventMap,
  PeerEventCallback,
} from '@speek/common-definitions';

export class PeerImpl implements Peer {
  conn: RTCPeerConnection;

  get connection(): RTCPeerConnectionState {
    return this.conn.connectionState;
  }
  get signaling(): RTCSignalingState {
    return this.conn.signalingState;
  }

  events: PeerEventCallback<PeerEvent | any>;

  constructor(private readonly iceServers: RTCIceServer[]) {
    this.conn = new RTCPeerConnection({ iceServers: this.iceServers });

    this.events = new Map([]);

    this.conn.addEventListener('icecandidate', ({ candidate }) => {
      const events = this.events.get('iceCandidateChange');
      if (events) events(candidate);
    });

    this.conn.addEventListener('connectionstatechange', (ev) => {
      const target = ev.currentTarget as RTCPeerConnection;
      const events = this.events.get('connectionChange');
      if (events) events(target.connectionState);
    });

    this.conn.addEventListener('signalingstatechange', (ev) => {
      const target = ev.currentTarget as RTCPeerConnection;
      const events = this.events.get('signalingChange');
      if (events) events(target.signalingState);
    });

    this.conn.addEventListener('negotiationneeded', (ev) => {
      const target = ev.currentTarget as RTCPeerConnection;
      console.log(target);

      const events = this.events.get('negotiation');
      if (events) events(ev);
    });
  }

  on<K extends keyof PeerEventMap>(
    key: K,
    fn: Callback<PeerEventMap[K]>
  ): void {
    this.events.set(key, fn);
    // this.events[key].push(fn);
  }

  setRemote(sdp: RTCSessionDescription): void {
    this.conn.setRemoteDescription(sdp);
  }

  setTracks(stream: MediaStream): void {
    stream.getTracks().forEach((track) => this.conn.addTrack(track, stream));
  }

  async create(
    options?: RTCOfferOptions
  ): Promise<RTCSessionDescriptionInit> {
    return this.conn.createOffer(options).then(async (sdp) => {
      await this.conn.setLocalDescription(sdp);
      return sdp;
    });
  }

  async answer(
    offer: RTCSessionDescriptionInit,
    options?: RTCAnswerOptions
  ): Promise<RTCSessionDescriptionInit> {
    // return this.conn.setRemoteDescription(offer).then(async () => {
      return this.conn.createAnswer(options).then(async (sdp) => {
        await this.conn.setLocalDescription(sdp);
        return sdp;
      });
    // });
  }
}
