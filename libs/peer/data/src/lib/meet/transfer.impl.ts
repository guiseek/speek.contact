import {Subject} from 'rxjs'
import {PeerChatMessage} from '@speek/type'
import {Transfer} from './ports/transfer'

export class TransferImpl implements Transfer {
  private _message = new Subject<PeerChatMessage>()
  message$ = this._message.asObservable()

  private _binary = new Subject<ArrayBuffer>()
  binary$ = this._binary.asObservable()

  constructor(private channel: RTCDataChannel) {
    channel.onmessage = ({data}: MessageEvent<ArrayBuffer>) => {
      if (typeof data === 'string') {
        try {
          this._message.next(JSON.parse(data))
        } catch (err) {
          this._message.next(data)
        }
        // this._onMesssage.forEach((cb) => cb(data))
      }
      if (data instanceof ArrayBuffer) {
        this._binary.next(data)
      }
    }
  }

  sendMessage(message: PeerChatMessage) {
    this.channel.send(JSON.stringify(message))
  }
}
