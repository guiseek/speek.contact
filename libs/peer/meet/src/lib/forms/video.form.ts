import {FormGroup} from '@angular/forms'
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
}
