import {MediaMatcher} from '@angular/cdk/layout'
import {
  inject,
  OnInit,
  Component,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core'
import {MatDialog} from '@angular/material/dialog'
import {AuthFacade, Peer, StorageService} from '@speek/peer/data'
import {PeerChatMessage} from '@speek/type'
import {ChatComponent} from '../../components/chat/chat.component'
import {SettingsDialog} from '../../components/settings/settings.dialog'

@Component({
  selector: 'speek-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss'],
})
export class MeetComponent implements OnInit, OnDestroy {
  @ViewChild(ChatComponent, {static: true})
  chatComponent!: ChatComponent

  peer = inject(Peer)
  dialog = inject(MatDialog)
  storage = inject(StorageService)
  auth = inject(AuthFacade)

  mobileQuery: MediaQueryList

  private _mobileQueryListener: () => void

  panelOpenState = true

  chatMeta = {
    user: this.peer.user,
    meet: this.peer.meet ?? location.hash.replace('#/', ''),
  }
  chatOpened = false

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)')
    this._mobileQueryListener = () => changeDetectorRef.detectChanges()
    this.mobileQuery.addEventListener('change', this._mobileQueryListener)
  }

  ngOnInit() {
    const audio = this.storage.getItem('audioInput')
    const video = this.storage.getItem('videoInput')
    if (audio && video) this.peer.connect(audio, video)

    this.peer.onDataChannel = (dc) => {
      console.log(dc)
      if (dc.readyState === 'open') {
        this.chatOpened = true
      }
    }

    this.peer.onMessage = (message) => {
      console.log(message)
      this.chatComponent.addMessage(message)
    }

    this.peer.onProgress = (progress) => {
      console.log(progress)
    }
  }

  onSelect(files: FileList | null) {
    const file = files && files.item(0)
    if (file) this.peer.upload(file)
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
    this.chatComponent.addMessage(message)
    this.peer.sendMessage(message)
  }
  sendChatMessage(value: PeerChatMessage) {
    this.peer.sendMessage(value)
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener)
    this.peer.close()
  }
}
