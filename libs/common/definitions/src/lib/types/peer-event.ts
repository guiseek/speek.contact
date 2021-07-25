import { PeerEventMap } from "./peer-event-map";
import { Callback } from "./callback";

export type PeerEvent =
  | 'track'
  | 'negotiation'
  | 'signalingChange'
  | 'iceConnectionChange'
  | 'iceGatheringChange'
  | 'iceCandidateChange'
  | 'connectionChange'
  | 'iceCandidateError'
  | 'dataChannel'

export type PeerEventCallback<K extends PeerEvent> = Map<
  K,
  Callback<PeerEventMap[K]>
>;
