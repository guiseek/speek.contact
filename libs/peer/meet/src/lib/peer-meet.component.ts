import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewContainerRef,
} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {combineLatest, forkJoin} from 'rxjs'
import {AuthFacade, MediaFacade, PeerFacade} from '@speek/peer/data'
import {SubAsync} from '@speek/utils'
import {createChannelMessage} from './components'

@Component({
  selector: 'peer-meet',
  templateUrl: './peer-meet.component.html',
  styleUrls: ['./peer-meet.component.scss'],
})
export class PeerMeetComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoRef')
  private videoRef!: ElementRef<HTMLDivElement>

  @ViewChild('remoteRef')
  private remoteRef!: ElementRef<HTMLDivElement>

  @ViewChild('channelMessage', {read: ViewContainerRef})
  private channelMessage!: ViewContainerRef

  protected videoPanelOpen = true

  sub = new SubAsync()

  constructor(
    readonly mediaFacade: MediaFacade,
    readonly peerFacade: PeerFacade,
    readonly route: ActivatedRoute,
    readonly auth: AuthFacade
  ) {}

  ngAfterViewInit() {
    this.videoRef.nativeElement.appendChild(this.mediaFacade.videoElement)
    this.remoteRef.nativeElement.appendChild(this.peerFacade.videoElement)

    this.mediaFacade.loadStream()

    const {meet} = this.route.snapshot.params

    const userStream$ = combineLatest([
      this.auth.user$,
      this.mediaFacade.stream$,
    ])

    this.sub.async = userStream$.subscribe(([user, stream]) => {
      if (meet && user && stream && stream.active) {
        this.peerFacade.loadConnection(stream, meet, user.username)
      }
    })

    this.sub.async = this.peerFacade.stream$.subscribe((stream) => {
      this.peerFacade.videoElement.srcObject = stream
    })

    this.sub.async = this.peerFacade.code$.subscribe((code) => {
      if (code) this.peerFacade.loadChannel(code)

      this.peerFacade.sender$.subscribe((sender) => {
        this.peerFacade.channel$.subscribe((channel) => {
          if (sender && channel) {
            createChannelMessage(this.channelMessage, sender, channel, meet)
          }
        })
      })
    })
  }

  ngOnDestroy() {
    this.peerFacade.close()
    this.sub.unsub()
  }
}
