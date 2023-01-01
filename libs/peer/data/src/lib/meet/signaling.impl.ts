import {PeerMessageMap, Callback} from '@speek/type'
import {Signaling} from './ports/signaling'
import {io, Socket} from 'socket.io-client'

export class SignalingImpl implements Signaling {
  conn: Socket
  constructor(readonly signalingServer: string) {
    this.conn = io(signalingServer)
  }
  on<K extends keyof PeerMessageMap>(
    event: K,
    fn: Callback<PeerMessageMap[K]>
  ): void {
    this.conn.on<K>(event, fn as any)
  }
  emit<K extends keyof PeerMessageMap>(
    event: K,
    message: PeerMessageMap[K]
  ): void {
    this.conn.emit(event, message)
  }
}
