import {
  PeerChatMessage,
  PeerDirection,
  PeerMessage,
  PeerUiState,
} from '@speek/type'
import {Observable} from 'rxjs'
import {Transfer} from './transfer'

export abstract class Peer {
  abstract user?: string
  abstract meet?: string

  abstract uiState: PeerUiState

  abstract stream: MediaStream
  abstract remote?: MediaStream

  abstract conn: RTCPeerConnection

  /**
   * A nova mídia de entrada foi negociada para um
   * determinado RTCRtpReceivere esse receptor track foi
   * adicionado a quaisquer MediaStreams remotos associados.
   */
  abstract track$: Observable<MediaStreamTrack>
  // abstract set onTrack(callback: Callback<MediaStreamTrack>)

  /**
   * Stream local disponível
   */
  abstract stream$: Observable<MediaStream>
  // abstract set onStream(callback: Callback<MediaStream>)

  /**
   * Um novo RTCDataChannel é despachado para o script
   * em resposta ao outro par criando um canal.
   */
  abstract dataChannel$: Observable<RTCDataChannel>
  // abstract set onDataChannel(callback: Callback<RTCDataChannel>)

  abstract transfer$: Observable<Record<PeerDirection, Transfer | null>>

  public abstract connect(
    audio: MediaTrackConstraints,
    video: MediaTrackConstraints,
    uuid?: string
  ): void

  public abstract replaceTrack(
    audio: MediaTrackConstraints,
    video: MediaTrackConstraints
  ): Promise<void>

  abstract setDescription(): (value: RTCSessionDescriptionInit) => void

  abstract getSignalMessage(): (message: PeerMessage) => Promise<void>

  abstract getIceCandidate(): (event: RTCPeerConnectionIceEvent) => void

  abstract toggleVideo(stream: MediaStream): void

  abstract toggleAudio(stream: MediaStream): void

  abstract errorHandler(error: Event): void

  abstract close(): void
}
