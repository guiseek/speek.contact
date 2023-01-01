import {EventEmitter} from '@angular/core'
import {FormControl, FormGroup} from '@angular/forms'

export type SignForm<T> = {
  [K in keyof T]: FormControl<T[K]>
}

export abstract class SignComponent<T> {
  abstract sign: EventEmitter<T>

  abstract form: FormGroup<SignForm<T>>

  get value() {
    return this.form.value as T
  }

  onSubmit() {
    if (this.form.valid) {
      this.sign.emit(this.value)
    }
  }
}
