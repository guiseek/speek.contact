import {Observable} from 'rxjs'
import {MediaConstraints, MediaPermissions} from './media.state'

export abstract class MediaService {
  abstract videoElement: HTMLVideoElement
  abstract setSinkId(deviceId: string): void

  abstract setConstraints(constraints: MediaConstraints): void
  abstract getConstraints(): MediaConstraints | null

  abstract get audioState(): boolean
  abstract toggleAudio(): void

  abstract get videoState(): boolean
  abstract toggleVideo(): void

  abstract checkPermission<K extends keyof MediaPermissions>(
    device: K
  ): Observable<PermissionState>

  abstract getUser(constraints: MediaConstraints): Promise<MediaStream>
  abstract getDisplay(constraints: MediaConstraints): Promise<MediaStream>
}
