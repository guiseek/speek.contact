import {PeerChatMessage} from '@speek/type'
import {Observable} from 'rxjs'

export abstract class Transfer {
  abstract message$: Observable<PeerChatMessage>
  abstract binary$: Observable<ArrayBuffer>
  abstract sendMessage(message: PeerChatMessage): void
}
