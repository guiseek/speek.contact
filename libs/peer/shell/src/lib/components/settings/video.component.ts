import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core'

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

  @Input()
  poster = '/assets/images/video.svg'

  #stream?: MediaStream

  async ngAfterViewInit() {
    this.video.onloadedmetadata = () => this.video.classList.add('fade-in')
    this.#stream = await navigator.mediaDevices.getUserMedia({video: true})
    queueMicrotask(() => Object.assign(this.video, {srcObject: this.#stream}))
  }

  ngOnDestroy() {
    if (this.#stream) {
      const tracks = this.#stream.getTracks()
      tracks.forEach((track) => track.stop())
    }
  }
}
