import {
  Inject,
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {AuthFacade, Peer} from '@speek/peer/data'
import {SubAsync} from '@speek/utils'
import {combineLatest} from 'rxjs'
import { SettingsFacade } from './settings/settings.facade'
import {SettingsService} from './settings/settings.service'

@Component({
  selector: 'peer-meet',
  templateUrl: './peer-meet.component.html',
  styleUrls: ['./peer-meet.component.scss'],
})
export class PeerMeetComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoRef')
  private videoRef!: ElementRef<HTMLDivElement>

  protected panelOpenState = true

  sub = new SubAsync()

  constructor(
    @Inject('peer.constraints')
    private constraints: MediaStreamConstraints,
    readonly service: SettingsService,
    readonly facade: SettingsFacade,
    readonly route: ActivatedRoute,
    readonly auth: AuthFacade,
    readonly peer: Peer
  ) {}

  ngAfterViewInit() {
    this.videoRef.nativeElement.appendChild(this.service.videoElement)

    const {meet} = this.route.snapshot.params

    const userStream$ = combineLatest([this.auth.user$, this.facade.stream$])
    this.sub.async = userStream$.subscribe(([user, stream]) => {
      if (meet && user && stream && stream.active) {
        this.peer.connect(stream, meet, user.username)
      }
    })

    this.facade.loadStream(this.constraints)
    // this.service.loadStream(this.constraints)
  }

  ngOnDestroy() {
    this.peer.close()
    this.sub.unsub()
  }
}
