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

  update(exact: T) {
    this.patchValue({exact})
  }

  get exact() {
    return this.get('exact') as FormControl<T>
  }

  get ideal() {
    return this.get('ideal') as FormControl<T>
  }
}
