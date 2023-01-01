import {
  Input,
  Inject,
  Output,
  Component,
  OnDestroy,
  EventEmitter,
  AfterViewInit,
} from '@angular/core'
import {SubAsync} from '@speek/peer/utils'
import {fromEvent, map} from 'rxjs'
import {DeviceComponent} from '../device.compopnent'

@Component({
  selector: 'speek-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
})
export class AudioComponent
  extends DeviceComponent
  implements AfterViewInit, OnDestroy
{
  @Input()
  set value(value: MediaDeviceInfo) {
    if (value) {
      this.onSelectionChange(value, 'audioinput')
      this.control.setValue(value)
    }
  }

  @Output() valueChange = new EventEmitter<MediaDeviceInfo>()

  sub = new SubAsync()

  constructor(
    @Inject('peer.constraints')
    constraints: MediaStreamConstraints
  ) {
    super(constraints)
  }

  ngAfterViewInit() {
    this.onDeviceChange(navigator.mediaDevices, 'audioinput')

    this.sub.async = fromEvent(navigator.mediaDevices, 'devicechange')
      .pipe(map((event) => event.currentTarget as MediaDevices))
      .subscribe((devices) => this.onDeviceChange(devices, 'videoinput'))
  }

  ngOnDestroy() {
    this.sub.unsub()
    if (this.stream) {
      this.stopStream(this.stream)
    }
  }
}
