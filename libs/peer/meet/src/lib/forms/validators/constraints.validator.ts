import {AbstractControl} from '@angular/forms'

export const constraintsValidator =
  (constraints: string) => (control: AbstractControl) => {
    const audio = control.get('audio')
    const video = control.get('video')

    return audio && video && (audio.invalid || video.invalid)
      ? {constraints}
      : null
  }
