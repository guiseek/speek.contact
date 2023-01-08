import {fromEvent, map, startWith, Subject, switchMap} from 'rxjs'
import {StorageService} from '@speek/peer/data'
import {Injectable} from '@angular/core'
import {LocalSettings} from '@speek/type'

declare global {
  interface HTMLMediaElement {
    setSinkId(deviceId: string): void
  }
}

@Injectable({providedIn: 'root'})
export class SettingsService {
  // private _stream = new Subject<MediaStream>()
  // readonly stream$ = this._stream.asObservable()

  // private _state = new Subject<MediaStream>()
  // readonly state$ = this._state.asObservable()

  // private _devices = navigator.mediaDevices
  // readonly devices$ = fromEvent(this._devices, 'devicechange').pipe(
  //   startWith(() => this._devices.enumerateDevices()),
  //   switchMap(() => this._devices.enumerateDevices()),
  //   map((devices) => devices.map((dvc) => dvc.toJSON()))
  // )

  readonly videoElement

  constructor(private storage: StorageService<LocalSettings>) {
    this.videoElement = document.createElement('video')
    this.videoElement.poster = '/assets/images/video.svg'
    this.videoElement.classList.add('video-element')
    this.videoElement.autoplay = true
  }

  get setSinkIdSupported() {
    return 'setSinkId' in this.videoElement
  }

  setSinkId(deviceId: string) {
    if ('setSinkId' in this.videoElement) {
      this.videoElement.setSinkId(deviceId)
    }
  }

  setVideoStream(stream: MediaStream) {
    this.videoElement.srcObject = stream
  }

  // loadStream(constraints: MediaStreamConstraints = {}) {
  //   navigator.mediaDevices
  //     .getUserMedia(this.getConstraints(constraints))
  //     .then((stream) => {
  //       this.videoElement.srcObject = stream
  //       this._stream.next(stream)
  //     })
  // }

  getStream(constraints: MediaStreamConstraints = {}) {
    return navigator.mediaDevices.getUserMedia(this.getConstraints(constraints))
  }

  getDevices() {
    return navigator.mediaDevices.enumerateDevices()
  }

  getDeviceId(kind: MediaDeviceKind) {
    return this.storage.getItem(kind)
  }

  getDeviceState(key: 'audioenabled' | 'videoenabled' | 'speakerenabled') {
    return this.storage.getItem(key)
  }

  getTrackConstraints<K extends 'audio' | 'video'>(
    type: K,
    defaultValue: Partial<MediaStreamConstraints[K]> = {}
  ) {
    return Object.assign({}, defaultValue, {
      deviceId: this.storage.getItem(`${type}input`),
    })
  }

  getConstraints({audio, video}: MediaStreamConstraints) {
    const videoDevice = this.storage.getItem('videoinput')
    const audioDevice = this.storage.getItem('audioinput')
    return {
      video: Object.assign({}, video, {deviceId: videoDevice}),
      audio: Object.assign({}, audio, {deviceId: audioDevice}),
    }
  }

  setItem<K extends keyof LocalSettings>(key: K, value: LocalSettings[K]) {
    this.storage.setItem(key, value)
  }
}
