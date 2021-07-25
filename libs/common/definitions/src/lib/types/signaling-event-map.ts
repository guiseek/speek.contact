export type SignalingEventMap = {
  offer: RTCSessionDescription;
  answer: RTCSessionDescription;
  candidate: RTCIceCandidate;
  connection: string;
  knocknock: RTCOfferOptions;
};
