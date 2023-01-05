import {
  Input,
  Output,
  Component,
  ViewChild,
  OnDestroy,
  ElementRef,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core'
import {Transfer} from '@speek/peer/data'
import {PeerDirection, PeerUiState} from '@speek/type'

@Component({
  selector: 'peer-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamComponent implements OnDestroy {
  @ViewChild('video', {static: true})
  videoRef!: ElementRef<HTMLVideoElement>
  private get video() {
    return this.videoRef.nativeElement
  }

  @ViewChild('canvas', {static: true})
  canvasRef!: ElementRef<HTMLCanvasElement>
  private get canvas() {
    return this.canvasRef.nativeElement
  }
  private context: CanvasRenderingContext2D | null = null

  @Input() state: PeerUiState = {
    audio: false,
    video: false,
  }

  @Input() stream?: MediaStream

  @Input() transfer?: Record<PeerDirection, Transfer | null> | null

  @Output() toggleVideo = new EventEmitter<MediaStream>()

  @Output() toggleAudio = new EventEmitter<MediaStream>()

  @Output() toggleChromaKey = new EventEmitter<void>()

  @Output() openChat = new EventEmitter<Record<
    PeerDirection,
    Transfer | null
  >>()

  chromaKeyEnabled = false
  private animationFrame = -1
  protected panelOpenState = true

  enableChromeKey() {
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

  private requestTimeUpdate = () => {
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

  private addAlpha(image: ImageData, minG = 98) {
    for (
      let r = 0, g = 1, b = 2, a = 3;
      a < image.data.length;
      r += 4, g += 4, b += 4, a += 4
    ) {
      const R = image.data[r]
      const G = image.data[g]
      const B = image.data[b]

      if (G > minG && G > R + 50 && G > B + 50) {
        image.data[a] = 0
      }
    }
    return image
  }

  onOpenChat(transfer?: Record<PeerDirection, Transfer | null> | null) {
    if (transfer) this.openChat.emit(transfer)
  }

  ngOnDestroy() {
    if (this.animationFrame > -1) {
      cancelAnimationFrame(this.animationFrame)
    }
  }
}
