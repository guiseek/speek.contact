import {
  Input,
  Output,
  Component,
  ViewChild,
  OnDestroy,
  ElementRef,
  EventEmitter,
} from '@angular/core'
import {PeerUiState} from '@speek/type'

interface frameNumberArgInfo {
  framesCounts: number[]
  framesDurations: number[]
  timeScale: number
}

const getTimestampIndex = (
  argInfo: frameNumberArgInfo,
  timestampToFind: number
) => {
  // Convert user time to time units
  const findTime = timestampToFind * argInfo.timeScale
  let k = 0
  let time = 0

  for (let i = 0; i < argInfo.framesCounts.length; i += 1) {
    for (let j = 0; j < argInfo.framesCounts[i]; j += 1) {
      if (time >= findTime) {
        return Math.max(1, k - 1)
      }
      time += argInfo.framesDurations[i]
      k += 1
    }
  }

  return time >= findTime ? Math.max(0, k - 1) : k - 1
}

const BACKGROUND = `/assets/backgrounds/interior-of-empty-modern-office-it-company-modern.jpg`

@Component({
  selector: 'speek-local-stream',
  templateUrl: './local-stream.component.html',
  styleUrls: ['./local-stream.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalStreamComponent implements OnDestroy {
  @ViewChild('video', {static: true})
  videoRef!: ElementRef<HTMLVideoElement>
  get video() {
    return this.videoRef.nativeElement
  }

  @ViewChild('canvas', {static: true})
  canvasRef!: ElementRef<HTMLCanvasElement>
  get canvas() {
    return this.canvasRef.nativeElement
  }
  context: CanvasRenderingContext2D | null = null

  @Input() state: PeerUiState = {
    audio: false,
    video: false,
  }

  @Input() stream?: MediaStream

  @Output() toggleVideo = new EventEmitter<MediaStream>()

  @Output() toggleAudio = new EventEmitter<MediaStream>()

  panelOpenState = true
  chromaKeyEnabled = false
  private animationFrame = -1

  enableChromeKey(background = BACKGROUND) {
    this.canvas.width = this.video.videoWidth
    this.canvas.height = this.video.videoHeight

    this.context = this.canvas.getContext('2d', {willReadFrequently: true})

    this.chromaKeyEnabled = true

    this.requestTimeUpdate()

    return this.canvas.captureStream()
  }

  disableChromaKey() {
    this.chromaKeyEnabled = false
    cancelAnimationFrame(this.animationFrame)
  }

  requestTimeUpdate = () => {
    if (!this.chromaKeyEnabled) return

    this.processChromaKey()

    this.animationFrame = requestAnimationFrame(this.requestTimeUpdate)
  }

  private processChromaKey = () => {
    const {width, height} = this.canvas
    if (this.context) {
      this.context.drawImage(this.video, 0, 0, width, height)
      this.context.filter

      const image = this.addAlpha(
        this.context.getImageData(0, 0, width, height)
      )

      this.context.putImageData(image, 0, 0)
    }
  }

  private addAlpha(image: ImageData, minG = 158) {
    for (
      let r = 0, g = 1, b = 2, a = 3;
      a < image.data.length;
      r += 4, g += 4, b += 4, a += 4
    ) {
      const R = image.data[r]
      const G = image.data[g]
      const B = image.data[b]

      if (G > minG && G > R && G > B) {
        image.data[a] = 0
      }
    }
    return image
  }

  ngOnDestroy() {
    if (this.animationFrame > -1) {
      cancelAnimationFrame(this.animationFrame)
    }
  }
}
