import { Injectable } from '@angular/core';

interface AsciiOptions {
  contrast?: number;
  callback: (ascii: string) => void;
}

@Injectable({
  providedIn: 'root',
})
export class CanvasAsciiService {
  constructor() {}

  private asciiFromCanvas(canvas: HTMLCanvasElement, options: AsciiOptions) {
    // Original code by Jacob Seidelin (http://www.nihilogic.dk/labs/jsascii/)
    // Heavily modified by Andrei Gheorghe (http://github.com/idevelop)

    const characters = ' .,:;i1tfLCG08@'.split('');

    const context = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    let asciiCharacters = '';

    // calculate contrast factor
    // http://www.dfstudios.co.uk/articles/image-processing-algorithms-part-5/

    if (options.contrast) {
      const contrastFactor =
        (259 * (options.contrast + 255)) / (255 * (259 - options.contrast));

      const imageData = context?.getImageData(0, 0, canvasWidth, canvasHeight);

      if (imageData) {
        for (let y = 0; y < canvasHeight; y += 2) {
          // every other row because letters are not square
          for (let x = 0; x < canvasWidth; x++) {
            // get each pixel's brightness and output corresponding character

            const offset = (y * canvasWidth + x) * 4;

            const { red, green, blue, alpha } = this.getColorAtOffset(
              imageData.data,
              offset
            );

            // increase the contrast of the image so that the ASCII representation looks better
            // http://www.dfstudios.co.uk/articles/image-processing-algorithms-part-5/
            const GB = [0, 255];
            const contrastedColor = {
              red: this.bound(
                Math.floor((red - 128) * contrastFactor) + 128,
                GB
              ),
              green: this.bound(
                Math.floor((green - 128) * contrastFactor) + 128,
                GB
              ),
              blue: this.bound(
                Math.floor((blue - 128) * contrastFactor) + 128,
                GB
              ),
              alpha: alpha,
            };

            // calculate pixel brightness
            // http://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
            const brightness =
              (0.299 * contrastedColor.red +
                0.587 * contrastedColor.green +
                0.114 * contrastedColor.blue) /
              255;

            const character =
              characters[
                characters.length -
                  1 -
                  Math.round(brightness * (characters.length - 1))
              ];

            asciiCharacters += character;
          }

          asciiCharacters += '\n';
        }
      }
    }

    options.callback(asciiCharacters);
  }

  private getColorAtOffset(data: Uint8ClampedArray, offset: number) {
    return {
      red: data[offset],
      green: data[offset + 1],
      blue: data[offset + 2],
      alpha: data[offset + 3],
    };
  }

  private bound(value: number, interval: number[]) {
    return Math.max(interval[0], Math.min(interval[1], value));
  }

  from(canvas: HTMLCanvasElement, options: AsciiOptions) {
    options.contrast = options.contrast ?? 128;
    return this.asciiFromCanvas(canvas, options);
  }
}
