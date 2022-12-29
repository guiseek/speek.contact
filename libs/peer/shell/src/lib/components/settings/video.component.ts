import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  Input,
  inject,
} from '@angular/core'
import {StorageService} from '../../services/storage.service'
import {SettingsService} from './settings.service'

@Component({
  selector: 'speek-video',
  template: `<video
    #video
    autoplay
    playsinline
    muted
    [poster]="poster"
  ></video>`,
  styles: [
    `
      :host {
        display: block;
        --size: var(--mdc-dialog-container-shape, var(--mdc-shape-medium, 4px));
        border-radius: var(--size);
        margin-bottom: calc(var(--size) * -1);

        video {
          width: 360px;
          height: 180px;
          object-fit: cover;
          object-position: center;
        }
      }
    `,
  ],
})
export class VideoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video')
  private videoRef!: ElementRef<HTMLVideoElement>
  private get video() {
    return this.videoRef.nativeElement
  }

  storage = inject(StorageService)
  settings = inject(SettingsService)

  @Input()
  poster = '/assets/images/video.svg'

  #stream?: MediaStream

  async ngAfterViewInit() {
    this.settings.videoInput$.subscribe(async (videoInput) => {
      console.log(videoInput);

      const {deviceId} = videoInput ?? {}
      console.log(`deviceId: `, deviceId);

      const constraints = deviceId ? {deviceId, video: true} : {video: true}
      this.#stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.video.srcObject = this.#stream
    })

    this.settings.loadDevices()
    // this.video.onloadedmetadata = () => this.video.classList.add('fade-in')
    // const {deviceId} = this.storage.getItem('videoInput') ?? {}
    // const constraints = deviceId ? {deviceId, video: true} : {video: true}
    // this.#stream = await navigator.mediaDevices.getUserMedia(constraints)
    // queueMicrotask(() => Object.assign(this.video, {srcObject: this.#stream}))
  }

  ngOnDestroy() {
    if (this.#stream) {
      const tracks = this.#stream.getTracks()
      tracks.forEach((track) => track.stop())
    }
  }
}
