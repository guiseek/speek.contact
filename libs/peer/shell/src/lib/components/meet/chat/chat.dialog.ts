import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import {
  inject,
  Inject,
  OnInit,
  Component,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core'
import {Transfer} from '@speek/peer/data'
import {PeerChatMessage, PeerDirection} from '@speek/type'
import {BehaviorSubject} from 'rxjs'

@Component({
  templateUrl: './chat.dialog.html',
  styleUrls: ['./chat.dialog.scss'],
})
export class ChatDialog implements OnInit {
  @ViewChild('section', {static: true})
  sectionRef!: ElementRef<HTMLElement>
  get section() {
    return this.sectionRef.nativeElement
  }

  private _messages = new BehaviorSubject<PeerChatMessage[]>([])
  readonly messages$ = this._messages.asObservable()

  cdr = inject(ChangeDetectorRef)

  protected isYou(user: string) {
    return this.data.meta.user === user ? 'Você' : 'Outra pessoa'
  }

  constructor(
    public dialogRef: MatDialogRef<ChatDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      meta: {user: string; meet: string}
      channel: Record<PeerDirection, Transfer>
    }
  ) {}

  ngOnInit() {
    const receiver = this.data.channel.receiver
    receiver.message$.subscribe(this.addMessage)
  }

  addMessage = (message: PeerChatMessage) => {
    this._messages.next([...this._messages.value, message])
    this.cdr.detectChanges()

    const selector = 'mat-card:last-child'
    const last = this.section.querySelector(selector)
    if (last) last.scrollIntoView({behavior: 'smooth'})
  }

  submit(input: HTMLInputElement) {
    if (input.value) {
      const data = {time: new Date(), text: input.value}
      const message = {...this.data.meta, ...data}

      this.data.channel.sender.sendMessage(message)
      this.addMessage(message)

      input.value = ''
    }
  }
}
