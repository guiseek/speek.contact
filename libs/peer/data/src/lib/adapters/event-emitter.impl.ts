import {EventCallback} from '../interfaces/event-callback'
import {EventEmitter} from '../interfaces/event-emitter'
import {PeerEventMap} from '../interfaces/peer-event-map'
import {Callback} from '../interfaces/socket'

export class EventEmitterImpl implements EventEmitter<PeerEventMap> {
  events: EventCallback<PeerEventMap>

  constructor() {
    this.events = new Map()
  }

  public on<K extends keyof PeerEventMap>(
    key: K,
    fn: Callback<PeerEventMap[K]>
  ): void {
    const events = this.events.get(key) ?? []
    events.push(fn as () => void)
    this.events.set(key, events)
  }

  get<K extends keyof PeerEventMap>(key: K): Callback<PeerEventMap[K]>[] {
    return this.events.get(key) ?? []
  }
}
