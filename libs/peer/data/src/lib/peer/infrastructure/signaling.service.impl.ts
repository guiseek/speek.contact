import {PeerMessageMap, Callback, Socket} from '@speek/type'
import {io} from 'socket.io-client'
import {SignalingService} from '../ports/signaling.service'

export class SignalingServiceImpl implements SignalingService {
  connection: Socket

  constructor(readonly signalingServer: string) {
    this.connection = io(signalingServer)
  }

  on<K extends keyof PeerMessageMap>(
    event: K,
    fn: Callback<PeerMessageMap[K]>
  ): void {
    this.connection.on<PeerMessageMap[K]>(event, fn)
  }

  emit<K extends keyof PeerMessageMap>(
    event: K,
    message: PeerMessageMap[K]
  ): void {
    this.connection.emit(event, message)
  }
}
