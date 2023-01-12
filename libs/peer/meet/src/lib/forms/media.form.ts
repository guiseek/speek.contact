import {FormGroup} from '@angular/forms'
import {ConstraintsForm} from './constraints.form'
import {ActiveForm} from './active.form'
import {StateForm} from './state.form'

export class MediaForm extends FormGroup {
  constructor() {
    super({
      active: new ActiveForm(),
      state: new StateForm(),
      constraints: new ConstraintsForm(),
    })
  }

  get active() {
    return this.get('active') as ActiveForm
  }
  get state() {
    return this.get('state') as StateForm
  }
  get constraints() {
    return this.get('constraints') as ConstraintsForm
  }
}
