import {FormControl, FormGroup} from '@angular/forms'
import {Constrain, Primitive} from '@speek/type'
import {TypeForm} from './types'

export class ConstrainForm<T extends Primitive = string> extends FormGroup<
  TypeForm<Constrain<T>>
> {
  constructor({ideal, exact = null}: Constrain<T>) {
    super({
      exact: new FormControl(exact),
      ideal: new FormControl(ideal, {
        nonNullable: true,
      }),
    })
  }
}
