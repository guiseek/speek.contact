import {FormGroup} from '@angular/forms'
import {VideoConstrain} from '@speek/type'
import {that} from '@speek/utils'
import {ConstrainIntForm} from './constrain-int.form'
import {ConstrainForm} from './constrain.form'

export class VideoForm extends FormGroup {
  constructor() {
    super({
      deviceId: new ConstrainForm<string>({
        ideal: 'default',
        exact: null,
      }),
      height: new ConstrainIntForm({
        min: 360,
        max: 1080,
        ideal: 720,
        exact: null,
      }),
    })
  }

  populate({deviceId, height}: VideoConstrain) {
    this.getForm('deviceId').update(deviceId)
    this.getForm('height').update(height)
  }

  pick<K extends keyof VideoConstrain>(key: K) {
    return this.getForm(key).value
  }

  getForm<K extends keyof VideoConstrain>(key: K) {
    return that(this.get(key)).as<ConstrainForm<VideoConstrain[K]>>()
  }
}
