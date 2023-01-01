import {Callback} from '@speek/type'

export abstract class Transfer {
  abstract set onMesssage(callback: Callback<string>)
  abstract set onBinary(callback: Callback<ArrayBuffer>)
}
