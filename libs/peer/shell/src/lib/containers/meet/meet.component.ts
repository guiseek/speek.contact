import {MediaMatcher} from '@angular/cdk/layout'
import {
  inject,
  OnInit,
  Component,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core'
import {MatDialog} from '@angular/material/dialog'
import {ActivatedRoute} from '@angular/router'
import {AuthFacade, Peer, StorageService, Transfer} from '@speek/peer/data'
import {PeerDirection} from '@speek/type'
import {filter} from 'rxjs'
import {
  ChatDialog,
  SettingsDialog,
  LocalStreamComponent,
} from '../../components'

@Component({
  selector: 'speek-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss'],
})
export class MeetComponent implements OnInit, OnDestroy {
  @ViewChild(LocalStreamComponent)
  localStream!: LocalStreamComponent

  peer = inject(Peer)
  dialog = inject(MatDialog)
  storage = inject(StorageService)
  auth = inject(AuthFacade)
  route = inject(ActivatedRoute)

  mobileQuery: MediaQueryList

  private _mobileQueryListener: () => void

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
    if (!audio || !video) this.openSettings()
  }

  openChat(channel: Record<PeerDirection, Transfer | null>) {
    const {user, meet} = this.peer

    this.dialog.open(ChatDialog, {
      data: {meta: {user, meet}, channel},
      panelClass: 'meet-chat-dialog',
      hasBackdrop: false,
    })
  }

  openSettings() {
    const dialog = this.dialog.open(SettingsDialog)
    dialog.afterClosed().subscribe(() => {
      const audio = this.storage.getItem('audioInput')
      const video = this.storage.getItem('videoInput')

      this.peer.replaceTrack(audio, video)
    })
  }

  toggleChromaKey() {
    if (!this.localStream.chromaKeyEnabled) {
      const [videoTrack] = this.peer.stream.getVideoTracks()

      const senderVideo = this.peer.conn
        .getSenders()
        .find(({track}) => track?.kind === videoTrack.kind)

      const stream = this.localStream.enableChromeKey()
      const [newVideoTrack] = stream.getVideoTracks()

      if (senderVideo) {
        senderVideo.replaceTrack(newVideoTrack)
      }
    } else {
      const audio = this.storage.getItem('audioInput')
      const video = this.storage.getItem('videoInput')

      this.peer.replaceTrack(audio, video)

      this.localStream.disableChromaKey()
    }
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener)
    this.peer.close()
  }
}
