import {AbstractControl} from '@angular/forms'

export const ActiveValidator =
  (active: string) => (control: AbstractControl) => {
    const audio = control.get('audio')
    const video = control.get('video')

    return audio && video && audio.value === false && video.value === false
      ? {active}
      : null
  }
