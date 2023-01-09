import {Input, OnDestroy, Directive, ElementRef} from '@angular/core'

@Directive({selector: 'canvas[speekAudioFrequency]'})
export class AudioFrequencyDirective implements OnDestroy {
  @Input() background = '#ffffff'
  @Input() color = '#666666'
  @Input() opacity = 100

  @Input() set speekAudioFrequency(stream: MediaStream) {
    if (stream) this.renderFrequency(stream)
  }

  stream?: MediaStream

  animationFrame?: number

  get canvas() {
    return this.elRef.nativeElement
  }

  constructor(readonly elRef: ElementRef<HTMLCanvasElement>) {}

  renderFrequency(stream: MediaStream) {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }

    if (this.stream) {
      this.stopStream(this.stream)
    }

    this.stream = stream

    const audioCtx = new AudioContext()
    const canvasCtx = this.canvas.getContext('2d')

    if (canvasCtx) {
      const microphoneNode = audioCtx.createMediaStreamSource(stream)
      const analyserNode = audioCtx.createAnalyser()
      const speakerNode = audioCtx.destination

      const {width, height} = this.canvas

      const draw = () => {
        const bufferLength = analyserNode.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyserNode.getByteTimeDomainData(dataArray)

        canvasCtx.fillStyle = this.background

        canvasCtx.fillRect(0, 0, width, height)
        const barWidth = width / bufferLength

        let barHeight
        let xPosition = 0

        for (let index = 0; index < bufferLength; index++) {
          barHeight = dataArray[index] / 1.6

          canvasCtx.fillStyle = this.hexToRgba(this.color, this.opacity)

          canvasCtx.fillRect(xPosition, height - barHeight, barWidth, barHeight)

          xPosition += barWidth
        }

        this.animationFrame = requestAnimationFrame(draw)
      }

      draw()

      microphoneNode.connect(analyserNode)
      analyserNode.connect(speakerNode)
    }
  }

  private hexToRgba(hex: string, alpha: number = 1) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    return `rgba(${r},${g},${b},${alpha})`
  }

  private changeColor(bar: number, hex: string, alpha = 1) {
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${bar},${g},${b},${alpha})`
  }

  stopStream(stream: MediaStream) {
    const tracks = stream.getTracks()
    tracks.forEach((track) => track.stop())
    this.stream = undefined
  }

  ngOnDestroy() {
    if (this.stream) {
      this.stopStream(this.stream)
    }
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
  }
}
