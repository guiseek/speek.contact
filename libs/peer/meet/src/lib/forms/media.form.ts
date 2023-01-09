import {FormGroup} from '@angular/forms'
import {AudioForm} from './audio.form'
import {VideoForm} from './video.form'

export class MediaForm extends FormGroup {
  constructor() {
    super({
      audio: new AudioForm(),
      video: new VideoForm(),
    })
  }

  get audio() {
    return this.get('audio') as AudioForm
  }
  get video() {
    return this.get('video') as VideoForm
  }
}
