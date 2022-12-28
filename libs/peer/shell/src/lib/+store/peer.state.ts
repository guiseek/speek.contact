import {Injectable} from '@angular/core'
import {State} from './state'

interface Peer {
  audio: boolean
  video: boolean
}

const initialState: Peer = Object.freeze({
  audio: true,
  video: true,
})

@Injectable({
  providedIn: 'root',
})
export class PeerState extends State<Peer> {
  audio$ = this.select((s) => s.audio)
  video$ = this.select((s) => s.video)

  constructor() {
    super(initialState)
  }

  toggle(prop: keyof Peer) {
    const state = this.state[prop]
    this.setState({[prop]: !state})
  }
}
