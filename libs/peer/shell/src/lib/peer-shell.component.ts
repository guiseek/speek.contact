import {Component} from '@angular/core'

@Component({
  selector: 'speek-peer-shell',
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
export class PeerShellComponent {}
