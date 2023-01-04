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

function getElementPosition<E extends HTMLElement>(obj: E) {
  let curleft = 0
  let curtop = 0
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft
      curtop += obj.offsetTop
    } while ((obj = obj.offsetParent as E))
    return {x: curleft, y: curtop}
  }
  return {x: 0, y: 0}
}

function getEventLocation<E extends HTMLElement>(
  element: E,
  event: MouseEvent
) {
  // Relies on the getElementPosition function.
  var pos = getElementPosition(element)

  return {
    x: event.pageX - pos.x,
    y: event.pageY - pos.y,
  }
}

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

  @Output() toggleChromaKey = new EventEmitter<void>()

  panelOpenState = true
  chromaKeyEnabled = false
  private animationFrame = -1
  private mins = [120]
  private isMins(value: number) {
    return this.mins.some((v) => value > v)
  }

  enableChromeKey() {
    this.canvas.width = this.video.videoWidth
    this.canvas.height = this.video.videoHeight

    this.onCanvasClick(this.canvas)
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

  onCanvasClick(canvas: HTMLCanvasElement) {
    canvas.onclick = (ev) => {
      const {x, y} = getEventLocation(canvas, ev)
      if (this.context) {
        const {data} = this.context.getImageData(x, y, 1, 1)
        this.mins.push(data[1])
      }
    }
  }

  ngOnDestroy() {
    if (this.animationFrame > -1) {
      cancelAnimationFrame(this.animationFrame)
    }
  }
}
