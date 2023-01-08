import {
  OnInit,
  ViewChild,
  Component,
  OnDestroy,
  ElementRef,
  AfterViewInit,
} from '@angular/core'
import {MediaFacade} from '@speek/peer/data'
import {MediaForm} from '../forms/media.form'
import {SubAsync} from '@speek/utils'

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

  constructor(readonly facade: MediaFacade) {}

  ngOnInit() {
    this.facade.load()

    if (this.facade.constraints) {
      this.form.patchValue(this.facade.constraints)
    }

    this.sub.async = this.facade.constraints$.subscribe((constraints) => {
      this.facade.loadStream(constraints)
    })

    this.sub.async = this.form.valueChanges.subscribe((value) => {
      this.facade.updateConstraints(value)
    })
  }

  ngAfterViewInit() {
    const videoElement = this.videoRef.nativeElement
    videoElement.appendChild(this.facade.videoElement)
    this.facade.loadStream()
  }

  ngOnDestroy() {
    this.sub.unsub()
  }
}
