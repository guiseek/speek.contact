import {FormControl, FormGroup} from '@angular/forms'
import {MediaActive} from '@speek/peer/data'
import {ActiveValidator} from './validators'
import {MESSAGES} from './messages'
import {TypeForm} from './types'

const validators = ActiveValidator(MESSAGES.ACTIVE)

export class ActiveForm extends FormGroup<TypeForm<MediaActive>> {
  constructor() {
    super(
      {
        audio: new FormControl(false, {
          nonNullable: true,
        }),
        video: new FormControl(false, {
          nonNullable: true,
        }),
      },
      {validators}
    )
  }

  get audio() {
    return this.get('audio') as FormControl<boolean>
  }
  get video() {
    return this.get('video') as FormControl<boolean>
  }
}
