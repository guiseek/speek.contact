import {
  Output,
  Component,
  OnDestroy,
  EventEmitter,
  AfterViewInit,
} from '@angular/core'
import {FormGroupDirective} from '@angular/forms'
import {VideoConstraints} from '@speek/type'
import {SubAsync} from '@speek/utils'
import {BehaviorSubject} from 'rxjs'
import {VideoForm} from '../../../forms/video.form'

@Component({
  selector: 'peer-video-constraints[formGroup]',
  templateUrl: './video-constraints.component.html',
  styleUrls: ['./video-constraints.component.scss'],
})
export class VideoConstraintsComponent implements AfterViewInit, OnDestroy {
  form = new VideoForm()

  private _devices = new BehaviorSubject<MediaDeviceInfo[]>([])
  devices$ = this._devices.asObservable()

  @Output() valueChanges = new EventEmitter<VideoConstraints>()

  sub = new SubAsync()

  constructor(readonly formGroup: FormGroupDirective) {}

  ngAfterViewInit() {
    if (this.formGroup.form) {
      this.form = this.formGroup.form as VideoForm
    }
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this._devices.next(
        devices.filter((device) => device.kind === 'videoinput')
      )
    })

    this.sub.async = this.form.valueChanges.subscribe((value) => {
      this.valueChanges.emit(value)
    })
  }

  ngOnDestroy() {
    this.sub.unsub()
  }
}
