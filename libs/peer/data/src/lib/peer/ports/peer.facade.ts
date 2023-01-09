import {PeerMessage} from '@speek/type'
import {Observable} from 'rxjs'

export abstract class PeerFacade {
  abstract code$: Observable<string | null>
  abstract stream$: Observable<MediaStream>
  abstract sender$: Observable<RTCDataChannel | null>
  abstract channel$: Observable<RTCDataChannel | null>

  abstract peer: RTCPeerConnection
  abstract videoElement: HTMLVideoElement

  abstract loadConnection(stream: MediaStream, meet: string, user: string): void

  abstract loadChannel(code: string): void

  abstract setDescription(
    meet: string,
    user: string
  ): (value: RTCSessionDescriptionInit) => void

  abstract loadSignalMessage(
    meet: string,
    user: string
  ): (message: PeerMessage) => Promise<void>

  abstract loadCandidate(
    meet: string,
    user: string
  ): (event: RTCPeerConnectionIceEvent) => void

  abstract catchError(error: Event): void

  abstract close(): void
}
