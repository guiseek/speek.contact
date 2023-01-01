import {PeerBase} from './peer-base'

export interface PeerMessage extends PeerBase {
  sdp?: RTCSessionDescription | null
  ice?: RTCIceCandidate | null
}
