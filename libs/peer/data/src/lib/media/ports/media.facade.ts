import {Observable} from 'rxjs'
import {MediaActive, MediaDeviceState, MediaPermissions} from './media.state'

export abstract class MediaFacade {
  abstract constraints$: Observable<MediaStreamConstraints>
  abstract permissions$: Observable<MediaPermissions>
  abstract get constraints(): MediaStreamConstraints | null
  abstract stream$: Observable<MediaStream | null>
  abstract error$: Observable<string | null>
  abstract audio$: Observable<boolean>
  abstract video$: Observable<boolean>
  abstract get videoElement(): HTMLVideoElement
  abstract setSinkId(sinkId: string): void
  abstract load(): void
  abstract loadStream(constraints?: MediaStreamConstraints): void
  abstract stopStream(stream?: MediaStream): void
  abstract updateState(
    state: Partial<MediaDeviceState>,
    stream: MediaStream | null
  ): void
  abstract updateConstraints(
    constraints: MediaStreamConstraints,
    active?: Partial<MediaActive>
  ): void
}
