export abstract class Peer {
  abstract id: string

  abstract stream: MediaStream
  abstract remote: MediaStream

  abstract conn: RTCPeerConnection

  public abstract connect(constraints: MediaStreamConstraints): void

  abstract toggleVideo(stream: MediaStream): void

  abstract toggleAudio(stream: MediaStream): void

  abstract close(): void
}
