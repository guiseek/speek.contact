export type PeerEvent =
  | 'track'
  | 'negotiation'
  | 'signalingChange'
  | 'iceConnectionChange'
  | 'iceGatheringChange'
  | 'iceCandidateChange'
  | 'connectionChange'
  | 'iceCandidateError'
  | 'dataChannel';
