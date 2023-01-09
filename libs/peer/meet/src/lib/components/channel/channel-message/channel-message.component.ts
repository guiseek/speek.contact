import {
  OnInit,
  Inject,
  ViewChild,
  Component,
  OnDestroy,
  ElementRef,
} from '@angular/core'
import {BehaviorSubject, fromEvent} from 'rxjs'
import {SubAsync} from '@speek/utils'

interface ChannelMessage {
  user: string
  meet: string
  text: string
  timestamp: string
  unread: boolean
}

@Component({
  selector: 'peer-channel-message',
  templateUrl: './channel-message.component.html',
  styleUrls: ['./channel-message.component.scss'],
})
export class ChannelMessageComponent implements OnInit, OnDestroy {
  @ViewChild('section', {static: true})
  sectionRef!: ElementRef<HTMLElement>
  private get section() {
    return this.sectionRef.nativeElement
  }

  private sub = new SubAsync()

  private _messages = new BehaviorSubject<ChannelMessage[]>([])
  readonly messages$ = this._messages.asObservable()

  private _unread = new BehaviorSubject<number>(0)
  readonly unread$ = this._unread.asObservable()

  protected chatPanelOpen = true

  readonly meet = ''
  readonly user = ''

  constructor(
    @Inject('channel') readonly channel: RTCDataChannel,
    @Inject('sender') readonly sender: RTCDataChannel
  ) {
    const [meet, user] = sender.label.split('-')
    Object.assign(this, {meet, user})
  }

  ngOnInit() {
    const messages$ = fromEvent<MessageEvent>(this.channel, 'message')
    this.sub.async = messages$.subscribe((ev) => this.handleMessage(ev))
  }

  private handleMessage(ev: MessageEvent) {
    if (typeof ev.data === 'string') {
      this.add(JSON.parse(ev.data))
      this.handleUnread()
    }
  }

  private handleUnread() {
    const messages = this._messages.value
    const filtered = messages.filter((message) => !!message.unread)
    this._unread.next(filtered.length)
  }

  handleRead() {
    let messages = this._messages.value
    messages = messages.map((message) => ({...message, unread: false}))
    this._messages.next(messages)
    this.handleUnread()
  }

  private scrollToLastMessage() {
    const selector = 'mat-card:last-child'
    const last = this.section.querySelector(selector)
    if (last) last.scrollIntoView({behavior: 'smooth'})
  }

  private add(message: ChannelMessage) {
    this._messages.next([...this._messages.value, message])
    queueMicrotask(() => this.scrollToLastMessage())
  }

  send(control: HTMLInputElement) {
    const message: ChannelMessage = {
      timestamp: new Date().toString(),
      text: control.value,
      meet: this.meet,
      user: this.user,
      unread: true,
    }
    this.sender.send(JSON.stringify(message))
    this.add({...message, unread: false})
    control.value = ''
  }

  ngOnDestroy() {
    this.sub.unsub()
  }
}
