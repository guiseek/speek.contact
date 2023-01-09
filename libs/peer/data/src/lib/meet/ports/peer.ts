import {PeerDirection, PeerMessage, PeerUiState} from '@speek/type'
import {Observable} from 'rxjs'
import {Transfer} from './transfer'

export abstract class Peer {
  abstract uiState: PeerUiState

  abstract stream: MediaStream
  abstract remote?: MediaStream

  abstract conn: RTCPeerConnection

  abstract transfer$: Observable<Record<PeerDirection, Transfer | null>>

  public abstract connect(stream: MediaStream, meet: string, user: string): void

  public abstract replaceTrack(
    oldStream: MediaStream,
    newStream: MediaStream
  ): void

  // public abstract replaceTrack(
  //   audio: MediaTrackConstraints,
  //   video: MediaTrackConstraints
  // ): Promise<void>

  abstract setDescription(
    meet: string,
    user: string
  ): (value: RTCSessionDescriptionInit) => void

  abstract getSignalMessage(
    meet: string,
    user: string
  ): (message: PeerMessage) => Promise<void>

  abstract getIceCandidate(
    meet: string,
    user: string
  ): (event: RTCPeerConnectionIceEvent) => void

  // abstract toggleVideo(stream: MediaStream): void

  // abstract toggleAudio(stream: MediaStream): void

  abstract errorHandler(error: Event): void

  abstract close(): void
}
