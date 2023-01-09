import {Callback, PeerMessageMap, Socket} from '@speek/type'

export abstract class SignalingService {
  abstract connection: Socket

  abstract on<K extends keyof PeerMessageMap>(
    event: K,
    fn: Callback<PeerMessageMap[K]>
  ): void

  abstract emit<K extends keyof PeerMessageMap>(
    event: K,
    message: PeerMessageMap[K]
  ): void
}
