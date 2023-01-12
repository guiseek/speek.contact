import {Observable} from 'rxjs'
import {MediaPermissions} from './media.state'

export abstract class MediaService {
  abstract videoElement: HTMLVideoElement
  abstract setSinkId(deviceId: string): void

  abstract setConstraints(constraints: MediaStreamConstraints): void
  abstract getConstraints(): MediaStreamConstraints | null

  abstract get audioState(): boolean
  abstract toggleAudio(): void

  abstract get videoState(): boolean
  abstract toggleVideo(): void

  abstract checkPermission<K extends keyof MediaPermissions>(
    device: K
  ): Observable<PermissionState>

  abstract getUser(constraints: MediaStreamConstraints): Promise<MediaStream>
  abstract getDisplay(constraints: MediaStreamConstraints): Promise<MediaStream>
}
