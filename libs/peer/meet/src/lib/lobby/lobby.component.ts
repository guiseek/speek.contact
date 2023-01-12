import {
  ViewChild,
  Component,
  OnDestroy,
  ElementRef,
  AfterViewInit,
} from '@angular/core'
import {combineLatest, distinctUntilChanged, filter} from 'rxjs'
import {ActivatedRoute, Router} from '@angular/router'
import {MediaFacade} from '@speek/peer/data'
import {SubAsync} from '@speek/utils'
import {MediaForm} from '../forms/media.form'

@Component({
  selector: 'peer-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoRef')
  private videoRef!: ElementRef<HTMLDivElement>

  protected form = new MediaForm()

  private sub = new SubAsync()

  constructor(
    protected facade: MediaFacade,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.facade.load()

    const constraintsActive$ = combineLatest([
      this.form.constraints.valueChanges,
      this.form.active.valueChanges,
    ])

    this.sub.async = constraintsActive$.subscribe(([constraints, active]) => {
      if (active.audio === false) this.form.disableAudio()
      if (active.audio === true) this.form.enableAudio()

      if (active.video === false) this.form.disableVideo()
      if (active.video === true) this.form.enableVideo()

      if (active.audio || active.video) {
        this.facade.updateConstraints(constraints, active)
      }
    })

    //

    const constraints$ = this.facade.constraints$

    this.sub.async = constraints$.subscribe(({audio, video}) => {
      if (audio || video) {
        this.facade.loadStream({audio, video})
      } else {
        this.facade.stopStream()
      }
    })

    //

    const stream$ = this.facade.stream$.pipe(filter((stream) => !!stream))

    this.sub.async = stream$.subscribe((stream) => {
      if (stream) {
        this.form.enableStateByActive()
      } else {
        this.form.disableStateByActive()
      }
    })

    //

    const streamState$ = combineLatest([
      this.facade.stream$,
      this.form.state.valueChanges,
    ]).pipe(distinctUntilChanged())

    this.sub.async = streamState$.subscribe(([stream, state]) => {
      if (stream) this.facade.updateState(state, stream)
    })

    //

    const speaker$ = this.form.speaker.valueChanges

    this.sub.async = speaker$.subscribe(({sinkId}) => {
      if (sinkId) this.facade.setSinkId(sinkId)
    })

    const emitEvent = true
    this.form.constraints.updateValueAndValidity({emitEvent})
    this.form.state.updateValueAndValidity({emitEvent})
    this.form.active.updateValueAndValidity({
      emitEvent: false,
    })

    queueMicrotask(() => {
      this.form.active.setValue({audio: false, video: false})
    })

    const videoElement = this.videoRef.nativeElement
    videoElement.appendChild(this.facade.videoElement)
  }

  next() {
    this.router.navigate(['..', 'meet'], {relativeTo: this.route})
  }

  ngOnDestroy() {
    this.sub.unsub()
  }
}
