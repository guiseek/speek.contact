import { Injectable } from '@angular/core';

export interface CameraOptions {
  fps: number;
  width: number;
  height: number;
  mirror: boolean;
  targetVideo?: HTMLVideoElement,
  targetCanvas?: HTMLCanvasElement;
}

@Injectable({
  providedIn: 'root',
})
export class CameraAsciiService {
  options!: CameraOptions;
  video!: HTMLVideoElement;
  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;
  renderTimer!: number;

  onFrame: (canvas: HTMLCanvasElement) => void = () => null;

  initVideoStream() {
    this.video = this.options.targetVideo || document.createElement('video');
    this.video.height = this.options.height;
    this.video.width = this.options.width;
    this.video.playsInline = true;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.video.srcObject = stream;
        this.initCanvas();
      });
  }

  initCanvas() {
    this.canvas = this.options.targetCanvas || document.createElement('canvas');
    console.log(this.canvas);

    this.canvas.setAttribute('width', this.options.width + '');
    this.canvas.setAttribute('height', this.options.height + '');

    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    // mirror video
    if (this.options.mirror) {
      this.context.translate(this.canvas.width, 0);
      this.context.scale(-1, 1);
    }
  }

  startCapture() {
    this.video.play();

    this.renderTimer = window.setInterval(() => {
      if (this.context) {
        this.context.drawImage(
          this.video,
          0,
          0,
          this.video.width,
          this.video.height
        );
        this.onFrame(this.canvas);
      }
    }, Math.round(1000 / this.options.fps));
  }

  stopCapture() {
    this.pauseCapture();
    this.video.srcObject = null;
  }

  pauseCapture() {
    if (this.renderTimer) {
      window.clearInterval(this.renderTimer);
    }
    this.video.pause();
  }

  init(
    captureOptions: CameraOptions = {
      fps: 30,
      width: 640,
      height: 480,
      mirror: false,
    }
  ) {
    this.options = { ...this.options, ...captureOptions }
    this.options.targetCanvas = this.options.targetCanvas;
    this.options.targetVideo = this.options.targetVideo;
    // this.options.targetCanvas = this.options.targetCanvas || null;

    this.initVideoStream();
  }

  clear() {
    window.clearInterval(this.renderTimer);
  }
}
