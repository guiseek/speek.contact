import {
  Output,
  Component,
  OnDestroy,
  EventEmitter,
  AfterViewInit,
} from '@angular/core'
import {FormGroupDirective} from '@angular/forms'
import {AudioConstraints} from '@speek/type'
import {SubAsync} from '@speek/utils'
import {BehaviorSubject} from 'rxjs'
import {AudioForm} from '../../../forms/audio.form'

@Component({
  selector: 'peer-audio-constraints',
  templateUrl: './audio-constraints.component.html',
  styleUrls: ['./audio-constraints.component.scss'],
})
export class AudioConstraintsComponent implements AfterViewInit, OnDestroy {
  form = new AudioForm()

  private _devices = new BehaviorSubject<MediaDeviceInfo[]>([])
  devices$ = this._devices.asObservable()

  @Output() valueChanges = new EventEmitter<AudioConstraints>()

  sub = new SubAsync()

  constructor(readonly formGroup: FormGroupDirective) {}

  ngAfterViewInit(): void {
    if (this.formGroup.form) {
      this.form = this.formGroup.form as AudioForm
    }
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this._devices.next(
        devices.filter((device) => device.kind === 'audioinput')
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
