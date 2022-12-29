import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core'
import {StorageService} from '../../services/storage.service'
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

  storage = inject(StorageService)

  #frequency?: ReturnType<typeof frequency>
  #stream?: MediaStream

  async ngAfterViewInit() {
    const audioCtx = new AudioContext()
    const canvasCtx = this.canvas.getContext('2d')

    if (canvasCtx) {
      const {deviceId} = this.storage.getItem('audioInput') ?? {}
      const constraints = deviceId ? {deviceId, audio: true} : {audio: true}
      this.#stream = await navigator.mediaDevices.getUserMedia(constraints)
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
