import {FormControl, FormGroup} from '@angular/forms'
import {SpeakerConstraints} from '@speek/type'
import {TypeForm} from './types'

export class SpeakerForm extends FormGroup<TypeForm<SpeakerConstraints>> {
  constructor() {
    super({
      sinkId: new FormControl<string>('default', {
        nonNullable: true,
      }),
    })
  }

  get sinkId() {
    return this.get('sinkId') as FormControl<string>
  }
}
