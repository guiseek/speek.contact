import {Component, inject} from '@angular/core'
import {Peer} from '@speek/peer/data'
import {short} from '../../shared/utilities/uuid'

@Component({
  selector: 'speek-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  randomRoom = short()

  peer = inject(Peer)

  constructor() {
    console.log(this.peer);

  }
}
