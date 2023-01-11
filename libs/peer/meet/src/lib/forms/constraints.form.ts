import {FormGroup} from '@angular/forms'
import {constraintsValidator} from './validators'
import {AudioForm} from './audio.form'
import {VideoForm} from './video.form'
import {MESSAGES} from './messages'

export class ConstraintsForm extends FormGroup {
  constructor() {
    super(
      {
        audio: new AudioForm(),
        video: new VideoForm(),
      },
      {validators: constraintsValidator(MESSAGES.CONSTRAINTS)}
    )
  }

  get audio() {
    return this.get('audio') as AudioForm
  }
  get video() {
    return this.get('video') as VideoForm
  }
}
