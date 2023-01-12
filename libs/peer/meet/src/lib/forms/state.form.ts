import {FormControl, FormGroup} from '@angular/forms'
import {MediaActive} from '@speek/peer/data'
import {TypeForm} from './types'

export class StateForm extends FormGroup<TypeForm<MediaActive>> {
  constructor() {
    super({
      audio: new FormControl(false, {
        nonNullable: true,
      }),
      video: new FormControl(false, {
        nonNullable: true,
      }),
    })

    this.disable()
  }

  get audio() {
    return this.get('audio') as FormControl<boolean>
  }
  get video() {
    return this.get('video') as FormControl<boolean>
  }
}
