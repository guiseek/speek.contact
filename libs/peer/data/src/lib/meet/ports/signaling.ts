import {Callback, PeerMessageMap, Socket} from '@speek/type'

export abstract class Signaling<T extends Socket = Socket> {
  abstract conn: T

  abstract on<K extends keyof PeerMessageMap>(
    event: K,
    fn: Callback<PeerMessageMap[K]>
  ): void

  abstract emit<K extends keyof PeerMessageMap>(
    event: K,
    message: PeerMessageMap[K]
  ): void
}
