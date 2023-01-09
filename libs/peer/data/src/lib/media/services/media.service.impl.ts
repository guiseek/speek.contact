import {
  MediaConstraints,
  MediaPermissions,
  MediaState,
} from '../ports/media.state'
import {MediaService} from '../ports/media.service'
import {StorageService} from '../../base'
import {EMPTY, from, fromEvent, map, startWith, switchMap, take} from 'rxjs'
import {Platform} from '@speek/utils'

export class MediaServiceImpl implements MediaService {
  videoElement: HTMLVideoElement

  constructor(
    private storage: StorageService<Omit<MediaState, 'stream'>>,
    private platform: Platform
  ) {
    this.videoElement = document.createElement('video')
    this.videoElement.poster = '/assets/images/video.svg'
    this.videoElement.classList.add('video-element')
    this.videoElement.autoplay = true
  }

  setSinkId(deviceId: string) {
    if ('setSinkId' in this.videoElement) {
      this.videoElement.setSinkId(deviceId)
    }
  }

  setConstraints(constraints: MediaConstraints) {
    this.storage.setItem('constraints', constraints)
  }
  getConstraints(): MediaConstraints | null {
    return this.storage.getItem('constraints')
  }

  get devices() {
    return navigator.mediaDevices.enumerateDevices()
  }

  checkPermission<K extends keyof MediaPermissions>(device: K) {
    return this.platform.CHROME
      ? from(
          navigator.permissions.query({name: device as PermissionName})
        ).pipe(
          take(1),
          switchMap((status) =>
            fromEvent(status, 'change').pipe(
              take(1),
              startWith(''),
              map(() => status.state)
            )
          )
        )
      : EMPTY
  }

  get audioState() {
    const audio = this.storage.getItem('audio')
    if (audio === null) {
      this.storage.setItem('audio', true)
      return true
    }
    return audio
  }
  toggleAudio() {
    const audio = !!this.storage.getItem('audio')
    this.storage.setItem('audio', !audio)
  }


  get videoState() {
    const video = this.storage.getItem('video')
    if (video === null) {
      this.storage.setItem('video', true)
      return true
    }
    return video
  }
  toggleVideo() {
    const video = !!this.storage.getItem('video')
    this.storage.setItem('video', !video)
  }

  private getStreamConstraints(defaults: Partial<MediaConstraints>) {
    if (this.platform.CHROME) {
      return {
        ...defaults,
        ...this.getConstraints(),
      } as MediaStreamConstraints
    }

    const {audio, video} = this.getConstraints() ?? {}

    return {
      audio: {
        deviceId: audio?.deviceId.exact ?? 'default',
        echoCancellation: audio?.echoCancellation.exact ?? true,
        noiseSuppression: audio?.noiseSupression.exact ?? true,
      },
      video: {
        deviceId: video?.deviceId.exact ?? 'default',
        height: video?.height.exact ?? 480,
      },
    } as MediaStreamConstraints
  }

  getUser(constraints: Partial<MediaConstraints>): Promise<MediaStream> {
    console.log(this.getStreamConstraints(constraints))

    return navigator.mediaDevices.getUserMedia(
      this.getStreamConstraints(constraints)
    )
  }
  getDisplay(constraints: MediaConstraints): Promise<MediaStream> {
    return navigator.mediaDevices.getDisplayMedia(
      this.getStreamConstraints(constraints)
    )
  }
}

declare global {
  interface HTMLMediaElement {
    setSinkId(id: string): Promise<void>
  }
}
