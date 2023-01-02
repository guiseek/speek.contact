import {MediaMatcher} from '@angular/cdk/layout'
import {
  inject,
  OnInit,
  Component,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core'
import {MatDialog} from '@angular/material/dialog'
import {ActivatedRoute} from '@angular/router'
import {AuthFacade, Peer, StorageService, Transfer} from '@speek/peer/data'
import {PeerChatMessage, PeerDirection} from '@speek/type'
import {filter, map} from 'rxjs'
import {SettingsDialog, ChatDialog} from '../../components'

@Component({
  selector: 'speek-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss'],
})
export class MeetComponent implements OnInit, OnDestroy {
  peer = inject(Peer)
  dialog = inject(MatDialog)
  storage = inject(StorageService)
  auth = inject(AuthFacade)
  route = inject(ActivatedRoute)

  mobileQuery: MediaQueryList

  private _mobileQueryListener: () => void

  panelOpenState = true

  chatMeta = {
    user: this.peer.user,
    meet: this.peer.meet ?? location.hash.replace('#/', ''),
  }

  channel$ = this.peer.transfer$.pipe(
    filter(({sender, receiver}) => !!sender && !!receiver)
  )

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)')
    this._mobileQueryListener = () => changeDetectorRef.detectChanges()
    this.mobileQuery.addEventListener('change', this._mobileQueryListener)
  }

  ngOnInit() {
    const audio = this.storage.getItem('audioInput')
    const video = this.storage.getItem('videoInput')
    const {id} = this.route.snapshot.params
    if (audio && video) this.peer.connect(audio, video, id)
  }

  onSelect(files: FileList | null) {
    const file = files && files.item(0)
    // if (file) this.peer.upload(file)
  }

  openChat(channel: Record<PeerDirection, Transfer | null>) {
    const {user, meet} = this.peer
    const data = {
      meta: {user, meet},
      channel,
    }
    this.dialog.open(ChatDialog, {data, panelClass: 'meet-chat-dialog'})
  }

  openSettings() {
    const dialog = this.dialog.open(SettingsDialog)
    dialog.afterClosed().subscribe(() => {
      const audio = this.storage.getItem('audioInput')
      const video = this.storage.getItem('videoInput')

      this.peer.replaceTrack(audio, video)
    })
  }

  onSendMessage(text: string) {
    const time = new Date()
    const {user, meet = ''} = this.peer
    const message = {user, meet, time, text}
    // this.chatComponent.addMessage(message)
    // this.peer.sendMessage(message)
  }
  sendChatMessage(value: PeerChatMessage) {
    // this.peer.sendMessage(value)
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener)
    this.peer.close()
  }
}
