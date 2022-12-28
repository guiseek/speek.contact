import {Component, inject, OnDestroy, OnInit} from '@angular/core'
import {FormBuilder, Validators} from '@angular/forms'
import {map, take} from 'rxjs'
import {SettingsConfig} from '../../../interfaces/settings-config'
import {StorageService} from '../../../services/storage.service'
import {SubAsync} from '../../../shared/utilities/sub-async'
import {SettingsService} from '../settings.service'

@Component({
  selector: 'speek-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent implements OnInit, OnDestroy {
  service = inject(SettingsService)
  storage = inject(StorageService)
  builder = inject(FormBuilder)

  form = this.builder.group({
    audioInput: [null, [Validators.required]],
    audioOutput: [null, [Validators.required]],
    videoInput: [null, [Validators.required]],
  })

  sub = new SubAsync()

  ngOnInit() {
    this.sub.async = this.form.valueChanges.subscribe((value) => {
      if (this.form.valid) {
        this.service.setValue(value)
        this.saveToStorage(value)
      }
    })

    this.service.config$
      .pipe(
        take(3),
        map(({audioInput, audioOutput, videoInput}) => {
          return {
            audioInput: this.storage.getItem('audioInput') ?? audioInput,
            audioOutput: this.storage.getItem('audioOutput') ?? audioOutput,
            videoInput: this.storage.getItem('videoInput') ?? videoInput,
          }
        })
      )
      .subscribe((value) => {
        this.saveToStorage(value)
        this.form.patchValue(value)
      })

    this.service.loadDevices()
  }

  saveToStorage(value: Partial<SettingsConfig>) {
    this.storage.setItem('audioInput', value.audioInput)
    this.storage.setItem('audioOutput', value.audioOutput)
    this.storage.setItem('videoInput', value.videoInput)
  }

  compareFn(d1: MediaDeviceInfo, d2: MediaDeviceInfo): boolean {
    return d1 && d2 ? d1.deviceId === d2.deviceId : d1 === d2
  }

  ngOnDestroy() {
    this.sub.unsub()
  }
}
