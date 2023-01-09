import {FormControl, FormGroup} from '@angular/forms'
import {ConstrainInt} from '@speek/type'
import {TypeForm} from './types'

export class ConstrainIntForm extends FormGroup<TypeForm<ConstrainInt>> {
  constructor({min, max, ideal, exact = null}: ConstrainInt) {
    super({
      max: new FormControl(max, {
        nonNullable: true,
      }),
      min: new FormControl(min, {
        nonNullable: true,
      }),
      exact: new FormControl(exact),
      ideal: new FormControl(ideal, {
        nonNullable: true,
      }),
    })
  }
}
