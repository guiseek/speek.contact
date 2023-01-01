import {Callback} from '@speek/type'
import {Transfer} from './ports/transfer'

export class TransferImpl implements Transfer {
  constructor(private channel: RTCDataChannel) {
    channel.onmessage = ({data}: MessageEvent<ArrayBuffer>) => {
      if (typeof data === 'string') {
        this._onMesssage.forEach((cb) => cb(data))
      }

      if (data instanceof ArrayBuffer) {
        this._onBinary.forEach((cb) => cb(data))
      }
    }
  }

  private _onMesssage: Callback<string>[] = []
  set onMesssage(callback: Callback<string>) {
    this._onMesssage.push(callback)
  }

  private _onBinary: Callback<ArrayBuffer>[] = []
  set onBinary(callback: Callback<ArrayBuffer>) {
    this._onBinary.push(callback)
  }
}
