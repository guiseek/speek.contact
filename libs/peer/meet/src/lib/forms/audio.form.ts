import {FormGroup} from '@angular/forms'
import {AudioConstrain} from '@speek/type'
import {that} from '@speek/utils'
import {ConstrainForm} from './constrain.form'

export class AudioForm extends FormGroup {
  constructor() {
    super({
      deviceId: new ConstrainForm<string>({
        ideal: 'default',
        exact: null,
      }),
      echoCancellation: new ConstrainForm<boolean>({
        ideal: true,
        exact: null,
      }),
      noiseSupression: new ConstrainForm<boolean>({
        ideal: true,
        exact: null,
      }),
    })
  }

  setDeviceId(deviceId: string) {
    this.getForm('deviceId').patchValue({exact: deviceId})
  }

  populate({
    deviceId,
    echoCancellation,
    noiseSupression,
  }: AudioConstrain) {
    this.getForm('deviceId').update(deviceId)
    this.getForm('echoCancellation').update(echoCancellation)
    this.getForm('noiseSupression').update(noiseSupression)
  }

  pick<K extends keyof AudioConstrain>(key: K) {
    return this.getForm(key).value
  }

  getForm<K extends keyof AudioConstrain>(key: K) {
    return that(this.get(key)).as<ConstrainForm<AudioConstrain[K]>>()
  }
}
