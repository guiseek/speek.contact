import {Component} from '@angular/core'
import {MatDialogRef} from '@angular/material/dialog'

@Component({
  selector: 'speek-settings',
  templateUrl: './settings.dialog.html',
  styleUrls: ['./settings.dialog.scss'],
})
export class SettingsDialog {
  constructor(readonly ref: MatDialogRef<SettingsDialog>) {}
}
