import {
  Output,
  Component,
  OnDestroy,
  EventEmitter,
  AfterViewInit,
} from '@angular/core'
import {FormGroupDirective} from '@angular/forms'
import {SpeakerConstraints} from '@speek/type'
import {MediaConstraintsBase} from '../media-constraints-base'
import {SpeakerForm} from '../../../forms/speaker.form'

@Component({
  selector: 'peer-speaker-constraints',
  templateUrl: './speaker-constraints.component.html',
})
export class SpeakerConstraintsComponent
  extends MediaConstraintsBase<SpeakerConstraints>
  implements AfterViewInit, OnDestroy
{
  form = new SpeakerForm()

  @Output() valueChanges = new EventEmitter<SpeakerConstraints>()

  constructor(readonly formGroup: FormGroupDirective) {
    super()
  }

  async ngAfterViewInit() {
    if (this.formGroup.form) {
      this.form = this.formGroup.form as SpeakerForm
    }

    this.afterViewInit('audiooutput')
  }

  ngOnDestroy() {
    this.onDestroy()
  }
}
