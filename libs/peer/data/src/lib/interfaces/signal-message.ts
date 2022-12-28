export interface SignalMessage {
  sdp: RTCSessionDescription
  ice: RTCIceCandidate
  id: string
}
