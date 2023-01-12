import {
  Output,
  Component,
  OnDestroy,
  EventEmitter,
  AfterViewInit,
} from '@angular/core'
import {FormGroupDirective} from '@angular/forms'
import {AudioConstraints} from '@speek/type'
import {MediaConstraintsBase} from '../media-constraints-base'
import {AudioForm} from '../../../forms/audio.form'

@Component({
  selector: 'peer-audio-constraints',
  templateUrl: './audio-constraints.component.html',
})
export class AudioConstraintsComponent
  extends MediaConstraintsBase<AudioConstraints>
  implements AfterViewInit, OnDestroy
{
  form = new AudioForm()

  @Output() valueChanges = new EventEmitter<AudioConstraints>()

  constructor(readonly formGroup: FormGroupDirective) {
    super()
  }

  ngAfterViewInit(): void {
    if (this.formGroup.form) {
      this.form = this.formGroup.form as AudioForm
    }

    this.afterViewInit('audioinput')
  }

  ngOnDestroy() {
    this.onDestroy()
  }
}
