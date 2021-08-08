import { PeerEvent, PeerEventCallback } from './../types/peer-event';
import { PeerEventMap } from '../types/peer-event-map';
import { Callback } from './../types/callback';

export abstract class Peer {
  abstract conn: RTCPeerConnection;

  abstract get connection(): RTCPeerConnectionState;

  abstract get signaling(): RTCSignalingState;

  abstract readonly events: PeerEventCallback<PeerEvent>;
  // abstract readonly events: Record<PeerEvent, Callback<PeerEventMap[PeerEvent]>[]>;

  abstract on<K extends keyof PeerEventMap>(
    key: K,
    fn: Callback<PeerEventMap[K]>
  ): void;

  abstract setRemote(sdp: RTCSessionDescription): void;

  abstract setTracks(stream: MediaStream): void;

  abstract create(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;

  abstract answer(offer: RTCSessionDescriptionInit, options?: RTCAnswerOptions): Promise<RTCSessionDescription | RTCSessionDescriptionInit>;
}
