import {FormGroup} from '@angular/forms'
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
}
