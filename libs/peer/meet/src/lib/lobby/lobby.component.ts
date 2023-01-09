import {
  OnInit,
  ViewChild,
  Component,
  OnDestroy,
  ElementRef,
  AfterViewInit,
} from '@angular/core'
import {MediaFacade} from '@speek/peer/data'
import {Platform, SubAsync} from '@speek/utils'
import {combineLatest} from 'rxjs'
import {MediaForm} from '../forms/media.form'

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

  constructor(readonly facade: MediaFacade, public platform: Platform) {
    console.log(platform)
  }

  ngOnInit() {
    this.facade.load()

    this.sub.async = this.form.valueChanges.subscribe((value) => {
      this.facade.updateConstraints(value)
    })
  }

  ngAfterViewInit() {
    const videoElement = this.videoRef.nativeElement
    videoElement.appendChild(this.facade.videoElement)

    this.sub.async = combineLatest([
      this.facade.permissions$,
      this.facade.constraints$,
    ]).subscribe(([{camera, microphone}, constraints]) => {
      if (camera !== 'denied' && microphone !== 'denied') {
        console.log(camera, microphone)

        this.facade.loadStream(constraints)

        const patchOptions = {emitEvent: false}
        this.form.patchValue(constraints, patchOptions)
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsub()
  }
}
