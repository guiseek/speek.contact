import {FormGroup} from '@angular/forms'
import {ConstraintsForm} from './constraints.form'
import {ActiveForm} from './active.form'
import {StateForm} from './state.form'
import {SpeakerForm} from './speaker.form'

export class MediaForm extends FormGroup {
  constructor() {
    super({
      active: new ActiveForm(),
      state: new StateForm(),
      constraints: new ConstraintsForm(),
      speaker: new SpeakerForm(),
    })
  }

  get active() {
    return this.get('active') as ActiveForm
  }
  get state() {
    return this.get('state') as StateForm
  }
  get constraints() {
    return this.get('constraints') as ConstraintsForm
  }
  get speaker() {
    return this.get('speaker') as SpeakerForm
  }

  disableAudio() {
    this.constraints.audio.disable({emitEvent: false})
    this.state.audio.disable({emitEvent: false})
  }
  enableAudio() {
    this.constraints.audio.enable({emitEvent: false})
    this.state.audio.enable({emitEvent: false})
  }

  disableVideo() {
    this.constraints.video.disable({emitEvent: false})
    this.state.video.disable({emitEvent: false})
  }

  enableVideo() {
    this.constraints.video.enable({emitEvent: false})
    this.state.video.enable({emitEvent: false})
  }

  enableStateByActive() {
    if (this.active.audio.value) {
      this.state.audio.enable()
    }
    if (this.active.video.value) {
      this.state.video.enable()
    }
  }

  disableStateByActive() {
    if (!this.active.audio.value) {
      this.state.audio.disable()
    }
    if (!this.active.video.value) {
      this.state.video.disable()
    }
  }
}
