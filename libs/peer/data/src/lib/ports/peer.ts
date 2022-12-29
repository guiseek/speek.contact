import {Callback} from '../interfaces/callback'

export abstract class Peer {
  abstract call: string
  abstract user: string

  abstract stream: MediaStream
  abstract remote: MediaStream

  abstract conn: RTCPeerConnection

  abstract set onStream(callback: Callback<MediaStream>)
  abstract set onChannel(callback: Callback<RTCDataChannel>)
  abstract set onTrack(callback: Callback<RTCTrackEvent>)

  public abstract connect(constraints?: MediaStreamConstraints): void

  abstract toggleVideo(stream: MediaStream): void

  abstract toggleAudio(stream: MediaStream): void

  abstract close(): void
}
