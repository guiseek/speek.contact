import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core'
import {frequency} from './utilities/frequency'

@Component({
  selector: 'speek-audio',
  template: `<canvas width="360" height="180" #canvas></canvas>`,
  styles: [
    `
      :host {
        display: block;
        --size: var(--mdc-dialog-container-shape, var(--mdc-shape-medium, 4px));
        border-radius: var(--size);
        margin-bottom: calc(var(--size) * -1);
      }
    `,
  ],
})
export class AudioComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas')
  private canvasRef!: ElementRef<HTMLCanvasElement>
  private get canvas() {
    return this.canvasRef.nativeElement
  }

  #frequency?: ReturnType<typeof frequency>
  #stream?: MediaStream

  async ngAfterViewInit() {
    const audioCtx = new AudioContext()
    const canvasCtx = this.canvas.getContext('2d')

    if (canvasCtx) {
      this.#stream = await navigator.mediaDevices.getUserMedia({audio: true})
      const microphoneNode = audioCtx.createMediaStreamSource(this.#stream)
      const analyserNode = audioCtx.createAnalyser()
      const speakerNode = audioCtx.destination

      microphoneNode.connect(analyserNode)
      analyserNode.connect(speakerNode)

      this.#frequency = frequency(analyserNode, this.canvas)
      this.#frequency.exec()
    }
  }

  ngOnDestroy() {
    if (this.#frequency) {
      this.#frequency.cancel()
    }
    if (this.#stream) {
      const tracks = this.#stream.getTracks()
      tracks.forEach((track) => track.stop())
    }
  }
}
