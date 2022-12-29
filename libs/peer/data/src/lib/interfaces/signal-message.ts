export interface SignalMessage {
  sdp: RTCSessionDescription
  ice: RTCIceCandidate
  call: string
  user: string
}
