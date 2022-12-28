import {Component, inject} from '@angular/core'
import {MatDialog} from '@angular/material/dialog'
import { PeerState } from './+store/peer.state'
import {SettingsDialog} from './components/settings/settings.dialog'

@Component({
  selector: 'speek-peer-shell',
  templateUrl: './peer-shell.component.html',
  styleUrls: ['./peer-shell.component.scss'],
})
export class PeerShellComponent {
  readonly peer = inject(PeerState)

  constructor(public dialog: MatDialog) {}

  openSettings() {
    const dialog = this.dialog.open(SettingsDialog, {})
  }
}
