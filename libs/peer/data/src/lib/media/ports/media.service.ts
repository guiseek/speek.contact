import {Observable} from 'rxjs'
import {MediaConstraints} from './media.state'

export abstract class MediaService {
  abstract videoElement: HTMLVideoElement
  abstract setSinkId(deviceId: string): void

  abstract setConstraints(constraints: MediaConstraints): void
  abstract getConstraints(): MediaConstraints | null

  abstract get audioState(): boolean
  abstract enableAudio(): void
  abstract disableAudio(): void

  abstract get videoState(): boolean
  abstract enableVideo(): void
  abstract disableVideo(): void

  abstract checkPermission(
    device: 'camera' | 'microphone'
  ): Observable<PermissionState>

  abstract getUser(constraints: MediaConstraints): Promise<MediaStream>
  abstract getDisplay(constraints: MediaConstraints): Promise<MediaStream>
}
