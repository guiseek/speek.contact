import {
  inject,
  Output,
  Component,
  EventEmitter,
  ChangeDetectorRef,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core'
import {PeerChatMessage} from '@speek/type'
import {BehaviorSubject} from 'rxjs'

@Component({
  selector: 'speek-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  private cdr = inject(ChangeDetectorRef)

  private _messages = new BehaviorSubject<PeerChatMessage[]>([])
  readonly messages$ = this._messages.asObservable()

  @Input() user = ''

  @Output() send = new EventEmitter<string>()

  addMessage(message: PeerChatMessage) {
    this._messages.next([...this._messages.value, message])
    this.cdr.detectChanges()
  }

  submit(message: HTMLInputElement) {
    if (message.value) {
      this.send.emit(message.value)
      message.value = ''
    }
  }
}
