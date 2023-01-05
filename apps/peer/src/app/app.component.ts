import {Component} from '@angular/core'

if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker(
    new URL('./workers/local-stream-track.worker', import.meta.url)
  )
  worker.onmessage = ({data}) => {
    console.log(`page got message: ${data}`)
  }
  worker.postMessage('hello')
} else {
  // Web workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}

@Component({
  selector: 'speek-root',
  template: `<router-outlet></router-outlet>`,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class AppComponent {
  title = 'peer'
}
