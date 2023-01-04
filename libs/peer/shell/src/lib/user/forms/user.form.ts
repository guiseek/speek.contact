import {FormControl, FormGroup, Validators} from '@angular/forms'

export class UserForm extends FormGroup {
  minDate: Date
  maxDate: Date

  constructor() {
    super({
      id: new FormControl(-1, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
        updateOn: 'blur',
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      displayName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      birthday: new FormControl('', {
        nonNullable: false,
      }),
      status: new FormControl(true, {
        nonNullable: true,
      }),
    })

    const currentYear = new Date().getFullYear()
    this.minDate = new Date(currentYear - 80, 0, 1)
    this.maxDate = new Date(currentYear + 1, 11, 31)
  }
}
