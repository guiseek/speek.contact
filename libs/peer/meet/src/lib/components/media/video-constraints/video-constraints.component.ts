import {
  Output,
  Component,
  OnDestroy,
  EventEmitter,
  AfterViewInit,
} from '@angular/core'
import {FormGroupDirective} from '@angular/forms'
import {VideoConstraints} from '@speek/type'
import {MediaConstraintsBase} from '../media-constraints-base'
import {VideoForm} from '../../../forms/video.form'

@Component({
  selector: 'peer-video-constraints',
  templateUrl: './video-constraints.component.html',
  styleUrls: ['../media-constraints-base.scss'],
})
export class VideoConstraintsComponent
  extends MediaConstraintsBase<VideoConstraints>
  implements AfterViewInit, OnDestroy
{
  form = new VideoForm()

  @Output() valueChanges = new EventEmitter<VideoConstraints>()

  constructor(readonly formGroup: FormGroupDirective) {
    super()
  }

  async ngAfterViewInit() {
    if (this.formGroup.form) {
      this.form = this.formGroup.form as VideoForm
    }

    this.afterViewInit('audioinput')
  }

  ngOnDestroy() {
    this.onDestroy()
  }
}
