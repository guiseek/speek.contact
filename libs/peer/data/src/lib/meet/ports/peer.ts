import {Callback, PeerChatMessage, PeerMessage, PeerProgress, PeerUiState} from '@speek/type'
import {Transfer} from './transfer'

export abstract class Peer {
  abstract user: string
  abstract meet?: string

  abstract uiState: PeerUiState

  abstract stream: MediaStream
  abstract remote?: MediaStream

  abstract conn: RTCPeerConnection

  abstract receiveBuffer: ArrayBuffer[]
  abstract receivedSize: number

  /**
   * A nova mídia de entrada foi negociada para um
   * determinado RTCRtpReceivere esse receptor track foi
   * adicionado a quaisquer MediaStreams remotos associados.
   */
  abstract set onTrack(callback: Callback<MediaStreamTrack>)

  /**
   * Stream local disponível
   */
  abstract set onStream(callback: Callback<MediaStream>)

  /**
   * O estado de sinalização mudou. Essa mudança
   * de estado é o resultado de um setLocalDescriptionou
   * de setRemoteDescriptionser invocado.
   */
  abstract set onSignalingChange(callback: Callback<RTCSignalingState>)

  /**
   * A RTCPeerConnectionState mudou.
   */
  abstract set onConnectionChange(callback: Callback<RTCPeerConnectionState>)

  /**
   * Um novo RTCIceCandidateé disponibilizado para o script.
   */
  abstract set onIceCandidateChange(callback: Callback<RTCIceCandidate>)

  /**
   * O RTCPeerConnection's estado encontro ICE mudou.
   */
  abstract set onIceGatheringChange(callback: Callback<RTCIceGatheringState>)

  /**
   * O RTCPeerConnectionIceEvent da conexão ICE mudou.
   */
  abstract set onIceConnectionChange(
    callback: Callback<RTCPeerConnectionIceEvent>
  )

  /**
   * Um novo RTCDataChannel é despachado para o script
   * em resposta ao outro par criando um canal.
   */
  abstract set onDataChannel(callback: Callback<RTCDataChannel>)

  /**
   * Dados recebidos via DataChannel
   */
  abstract set onData(callback: Callback<ArrayBuffer>)

  /**
   * Mensagem recebida via DataChannel
   */
  abstract set onMessage(callback: Callback<PeerChatMessage>)

  /**
   * Valores relativos a um envio de arquivos
   * usando DataChannel, úteis para progresso
   */
  abstract set onProgress(callback: Callback<PeerProgress>)

  abstract set onToggleAudio(callback: Callback<boolean>)

  abstract set onToggleVideo(callback: Callback<boolean>)

  public abstract connect(
    audio: MediaTrackConstraints,
    video: MediaTrackConstraints,
    uuid?: string
  ): void

  public abstract replaceTrack(
    audio: MediaTrackConstraints,
    video: MediaTrackConstraints
  ): Promise<void>

  public abstract send(message: string): void

  public abstract sendMessage<T extends PeerChatMessage>(message: T): void

  public abstract upload(message: File): void

  abstract openChannel(fn: (channel: Transfer) => void): void

  abstract setDescription(): (value: RTCSessionDescriptionInit) => void

  abstract getSignalMessage(): (message: PeerMessage) => Promise<void>

  abstract getIceCandidate(): (event: RTCPeerConnectionIceEvent) => void

  abstract onReceiveMessageCallback(data: ArrayBuffer): void

  abstract toggleVideo(stream: MediaStream): void

  abstract toggleAudio(stream: MediaStream): void

  abstract errorHandler(error: Event): void

  abstract close(): void
}
