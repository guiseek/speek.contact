import {MediaConstraints, MediaState} from '../ports/media.state'
import {MediaService} from '../ports/media.service'
import {StorageService} from '../../base'

export class MediaServiceImpl implements MediaService {
  videoElement: HTMLVideoElement

  constructor(private storage: StorageService<Omit<MediaState, 'stream'>>) {
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

  get audioState() {
    const audio = this.storage.getItem('audio')
    if (audio === null) {
      this.storage.setItem('audio', true)
      return true
    }
    return audio
  }
  enableAudio() {
    this.storage.setItem('audio', true)
  }
  disableAudio() {
    this.storage.setItem('audio', false)
  }

  get videoState() {
    const video = this.storage.getItem('video')
    if (video === null) {
      this.storage.setItem('video', true)
      return true
    }
    return video
  }
  enableVideo() {
    this.storage.setItem('video', true)
  }
  disableVideo() {
    this.storage.setItem('video', false)
  }

  private getStreamConstraints(defaults: Partial<MediaConstraints>) {
    return {
      ...defaults,
      ...this.getConstraints(),
    } as MediaStreamConstraints
  }

  getUser(constraints: Partial<MediaConstraints>): Promise<MediaStream> {
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
