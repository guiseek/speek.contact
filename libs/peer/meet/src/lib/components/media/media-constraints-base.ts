import {EventEmitter} from '@angular/core'
import {FormGroup} from '@angular/forms'
import {SubAsync} from '@speek/utils'
import {BehaviorSubject} from 'rxjs'

export abstract class MediaConstraintsBase<T> {
  private _devices = new BehaviorSubject<MediaDeviceInfo[]>([])
  readonly devices$ = this._devices.asObservable()

  private sub = new SubAsync()

  abstract form: FormGroup

  abstract valueChanges: EventEmitter<T>

  protected afterViewInit(kind: MediaDeviceKind) {
    this.loadDevices(kind)

    navigator.mediaDevices.ondevicechange = () => this.loadDevices(kind)

    this.sub.async = this.form.valueChanges.subscribe((value) => {
      this.valueChanges.emit(value)
    })
  }

  protected loadDevices(kind: MediaDeviceKind) {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const filterFn = (device: MediaDeviceInfo) => device.kind === kind
      this._devices.next(devices.filter(filterFn))
    })
  }

  protected onDestroy() {
    this.sub.unsub()
  }
}
