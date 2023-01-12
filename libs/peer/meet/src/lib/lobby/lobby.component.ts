import {
  OnInit,
  ViewChild,
  Component,
  OnDestroy,
  ElementRef,
  AfterViewInit,
} from '@angular/core'
import {MediaActive, MediaFacade} from '@speek/peer/data'
import {SubAsync} from '@speek/utils'
import {combineLatest, distinctUntilChanged, filter} from 'rxjs'
import {MediaForm} from '../forms/media.form'
import {ActivatedRoute, Router} from '@angular/router'

@Component({
  selector: 'peer-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoRef')
  private videoRef!: ElementRef<HTMLDivElement>

  readonly form = new MediaForm()

  sub = new SubAsync()

  constructor(
    readonly facade: MediaFacade,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.facade.load()
  }

  private disableAudio() {
    this.form.constraints.audio.disable({emitEvent: false})
    this.form.state.audio.disable({emitEvent: false})
  }

  private enableAudio() {
    this.form.constraints.audio.enable({emitEvent: false})
    this.form.state.audio.enable({emitEvent: false})
  }

  private disableVideo() {
    this.form.constraints.video.disable({emitEvent: false})
    this.form.state.video.disable({emitEvent: false})
  }

  private enableVideo() {
    this.form.constraints.video.enable({emitEvent: false})
    this.form.state.video.enable({emitEvent: false})
  }

  private getConstraints(
    {audio, video}: Partial<MediaActive>,
    constraints: MediaStreamConstraints
  ) {
    return {
      audio: audio ? constraints.audio : audio,
      video: video ? constraints.video : video,
    }
  }
  ngAfterViewInit() {
    combineLatest([
      this.form.constraints.valueChanges,
      this.form.active.valueChanges,
    ]).subscribe(([constraints, active]) => {
      if (active.audio === false) this.disableAudio()
      if (active.audio === true) this.enableAudio()

      if (active.video === false) this.disableVideo()
      if (active.video === true) this.enableVideo()

      if (active.audio || active.video) {
        const validConstraints = this.getConstraints(active, constraints)

        this.facade.loadStream(validConstraints)
      }
    })

    this.facade.stream$
      .pipe(filter((stream) => !!stream))
      .subscribe((stream) => {
        if (stream) {
          if (this.form.active.audio.value) {
            this.form.state.audio.enable()
          }
          if (this.form.active.video.value) {
            this.form.state.video.enable()
          }
        }
      })

    combineLatest([this.facade.stream$, this.form.state.valueChanges])
      .pipe(distinctUntilChanged())
      .subscribe(([stream, state]) => {
        if (stream) {
          const videoTracks = stream.getVideoTracks()
          videoTracks.forEach((track) => (track.enabled = !state.video))

          const audioTracks = stream.getAudioTracks()
          audioTracks.forEach((track) => (track.enabled = !state.audio))
        }
      })

    this.form.constraints.updateValueAndValidity({
      emitEvent: true,
    })

    this.form.state.updateValueAndValidity({
      emitEvent: true,
    })
    this.form.active.updateValueAndValidity({
      emitEvent: false,
    })

    const videoElement = this.videoRef.nativeElement
    videoElement.appendChild(this.facade.videoElement)

    this.facade.loadStream(this.form.constraints.value)
  }

  next() {
    this.router.navigate(['..', 'meet'], {relativeTo: this.route})
  }

  ngOnDestroy() {
    this.sub.unsub()
  }
}
