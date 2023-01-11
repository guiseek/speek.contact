import {FormGroup} from '@angular/forms'
import {ConstrainForm} from './constrain.form'

export class AudioForm extends FormGroup {
  constructor() {
    super({
      deviceId: new ConstrainForm<string>({
        ideal: 'default',
      }),
      echoCancellation: new ConstrainForm<boolean>({
        ideal: true,
        exact: true,
      }),
      noiseSupression: new ConstrainForm<boolean>({
        ideal: true,
        exact: true,
      }),
    })
  }
  get deviceId() {
    return this.get('deviceId') as ConstrainForm<string>
  }
  get echoCancellation() {
    return this.get('echoCancellation') as ConstrainForm<boolean>
  }
  get noiseSupression() {
    return this.get('noiseSupression') as ConstrainForm<boolean>
  }
}
