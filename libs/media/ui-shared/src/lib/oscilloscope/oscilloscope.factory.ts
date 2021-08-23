export interface CanvasStyle {
  fill?: string;
  stroke?: string;
}

export class OscilloscopeFactory {
  static draw(
    canvas: HTMLCanvasElement,
    analyser: AnalyserNode,
    style: CanvasStyle = {}
  ) {
    requestAnimationFrame(() => {
      OscilloscopeFactory.draw(canvas, analyser, style);
    });

    const canvasCtx = canvas.getContext('2d');

    if (canvasCtx) {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = style.fill ?? '#212121';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = style.stroke ?? '#bb86fc';

      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    }
  }
}
