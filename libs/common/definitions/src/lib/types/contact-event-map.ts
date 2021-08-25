export type ContactEventMap = {
  offer: RTCSessionDescription;
  answer: RTCSessionDescription;
  candidate: RTCIceCandidate;
  connection: string;
  knocknock: RTCOfferOptions;
};
