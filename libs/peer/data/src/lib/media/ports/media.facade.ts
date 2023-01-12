import {Observable} from 'rxjs'
import {MediaPermissions} from './media.state'

export abstract class MediaFacade {
  abstract constraints$: Observable<MediaStreamConstraints>
  abstract permissions$: Observable<MediaPermissions>
  abstract get constraints(): MediaStreamConstraints | null
  abstract stream$: Observable<MediaStream | null>
  abstract error$: Observable<string | null>
  abstract audio$: Observable<boolean>
  abstract video$: Observable<boolean>
  abstract get videoElement(): HTMLVideoElement
  abstract load(): void
  abstract loadStream(constraints?: MediaStreamConstraints): void
  abstract updateConstraints(constraints: Partial<MediaStreamConstraints>): void
  abstract toggleAudio(): void
  abstract toggleVideo(): void
}
