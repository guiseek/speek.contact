import {EventEmitter} from '@angular/core'
import {FormControl} from '@angular/forms'
import {BehaviorSubject} from 'rxjs'

export abstract class DeviceComponent {
  private _devices = new BehaviorSubject<MediaDeviceInfo[]>([])
  protected devices$ = this._devices.asObservable()

  abstract valueChange: EventEmitter<MediaDeviceInfo>

  abstract value: MediaDeviceInfo

  protected stream?: MediaStream

  protected control = new FormControl()

  constructor(readonly constraints: MediaStreamConstraints) {}

  private getConstraints(deviceId: string, kind: 'audio' | 'video') {
    let constraints = this.constraints[kind]

    if (typeof constraints !== 'boolean') {
      constraints = Object.assign({...constraints}, {deviceId})
    }

    return constraints
  }

  private getDevice(devices: MediaDeviceInfo[] = []) {
    switch (devices.length) {
      case 0:
        return null
      case 1:
        return devices[0]
      default:
        return devices.find((d) => d.deviceId === 'default')
    }
  }

  protected async onDeviceChange(
    mediaDevices: MediaDevices,
    kind: MediaDeviceKind
  ) {
    const _devices = await mediaDevices.enumerateDevices()
    const devices = _devices.filter((d) => d.kind === kind) ?? []

    this._devices.next(devices)

    const value = this.getDevice(devices)

    if (value) {
      this.control.setValue(value)
      this.onSelectionChange(this.control.value, kind)
    }
  }

  protected async onSelectionChange(
    device: MediaDeviceInfo,
    kind: MediaDeviceKind
  ) {
    if (device) {
      const key = kind.slice(0, 5) as 'audio' | 'video'
      const constraints = this.getConstraints(device.deviceId, key)

      if (this.stream) {
        this.stopStream(this.stream)
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        [key]: constraints,
      })

      this.valueChange.emit(device)
    }
  }

  protected compareFn(d1: MediaDeviceInfo, d2: MediaDeviceInfo): boolean {
    return d1 && d2 ? d1.deviceId === d2.deviceId : d1 === d2
  }

  protected stopStream(stream: MediaStream) {
    const tracks = stream.getTracks()
    tracks.forEach((track) => track.stop())
    this.stream = undefined
  }
}
