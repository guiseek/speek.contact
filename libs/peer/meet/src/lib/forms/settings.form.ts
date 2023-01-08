import {FormControl, FormGroup, Validators} from '@angular/forms'
import {AudioSettings, BaseSettings, VideoSettings} from '@speek/type'
import {Observable} from 'rxjs'
import {TypeForm} from './types'

interface SettingsValue {
  audio: AudioSettings
  speaker: BaseSettings
  video: VideoSettings
}

export class SettingsForm extends FormGroup {
  get changes(): Observable<SettingsValue> {
    return super.valueChanges
  }

  constructor() {
    super({
      audio: new FormGroup<TypeForm<AudioSettings>>({
        enabled: new FormControl(true, {
          nonNullable: true,
        }),
        echoCancellation: new FormControl(true, {
          nonNullable: true,
        }),
        deviceId: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
      speaker: new FormGroup<TypeForm<BaseSettings>>({
        enabled: new FormControl(true, {
          nonNullable: true,
        }),
        deviceId: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
      video: new FormGroup<TypeForm<VideoSettings>>({
        enabled: new FormControl(true, {
          nonNullable: true,
        }),
        deviceId: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        height: new FormControl(480, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    })
  }

  get audio() {
    return this.get('audio') as FormGroup<TypeForm<AudioSettings>>
  }

  get video() {
    return this.get('video') as FormGroup<TypeForm<VideoSettings>>
  }

  get speaker() {
    return this.get('speaker') as FormGroup<TypeForm<BaseSettings>>
  }

  get audioEnabled() {
    return this.audio.value.enabled
  }

  get videoEnabled() {
    return this.video.value.enabled
  }

  setAudioEnabled(enabled: boolean) {
    this.audio.patchValue({enabled})
  }

  toggleAudio() {
    const enabled = !this.audioEnabled
    this.audio.patchValue({enabled})
  }

  setVideoEnabled(enabled: boolean) {
    this.video.patchValue({enabled})
  }

  toggleVideo() {
    const enabled = !this.videoEnabled
    this.video.patchValue({enabled})
  }
}
