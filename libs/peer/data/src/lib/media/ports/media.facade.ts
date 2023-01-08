import {Observable} from 'rxjs'
import {MediaConstraints} from './media.state'

export abstract class MediaFacade {
  abstract constraints$: Observable<MediaConstraints>
  abstract get constraints(): MediaConstraints | null
  abstract stream$: Observable<MediaStream | null>
  abstract audio$: Observable<boolean>
  abstract video$: Observable<boolean>
  abstract get videoElement(): HTMLVideoElement
  abstract load(): void
  abstract loadStream(constraints?: MediaConstraints): void
  abstract updateConstraints(constraints: Partial<MediaConstraints>): void
  abstract toggleAudio(): void
  abstract toggleVideo(): void
}
