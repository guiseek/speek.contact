import {Component, inject} from '@angular/core'
import {StorageService} from '@speek/peer/data'

@Component({
  template: `
    <mat-tab-group dynamicHeight>
      <mat-tab label="Áudio">
        <ng-template matTabContent>
          <speek-audio
            [value]="audio"
            (valueChange)="onAudioChange($event)"
          ></speek-audio>
        </ng-template>
      </mat-tab>
      <mat-tab label="Vídeo">
        <ng-template matTabContent>
          <speek-video
            [value]="video"
            (valueChange)="onVideoChange($event)"
          ></speek-video>
        </ng-template>
      </mat-tab>
    </mat-tab-group>
    <mat-dialog-actions [align]="'end'">
      <button type="button" mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </mat-dialog-actions>
  `,
})
export class SettingsDialog {
  storage = inject(StorageService)

  video = this.storage.getItem('videoInput')
  audio = this.storage.getItem('audioInput')

  onVideoChange(value: MediaDeviceInfo) {
    this.storage.setItem('videoInput', value)
  }

  onAudioChange(value: MediaDeviceInfo) {
    this.storage.setItem('audioInput', value)
  }
}
