export type SignalingEventMap = {
  offer: RTCSessionDescriptionInit;
  answer: RTCSessionDescription;
  candidate: RTCIceCandidate;
  connection: string;
  knocknock: RTCOfferOptions;
};
