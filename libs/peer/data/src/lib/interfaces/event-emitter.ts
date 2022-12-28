import {EventCallback} from './event-callback'
import {Callback} from './callback'
import {HashMap} from './hash-map'

export interface EventEmitter<T extends HashMap<T>> {
  events: EventCallback<T>

  on<K extends keyof T>(key: K, fn: Callback<T[K]>): void

  get<K extends keyof T>(key: K): Callback<T[K]>[]
}
