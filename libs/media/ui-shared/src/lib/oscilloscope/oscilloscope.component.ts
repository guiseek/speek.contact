import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'media-oscilloscope',
  template: `<canvas #canvas></canvas>`,
  styles: [
    `
      canvas {
        width: 100%;
      }
    `,
  ],
})
export class OscilloscopeComponent implements OnDestroy {
  @ViewChild('canvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;
  canvasElement!: HTMLCanvasElement

  @Input() stream?: MediaStream;
  ngAfterViewInit(): void {
  console.log(this.canvasElement);

  }
  ngOnDestroy(): void {

  }
}
