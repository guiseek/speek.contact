import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {CdkModule, MaterialModule} from '@speek/peer/shared/layout'
import {peerMeetRoutes} from './lib.routes'
import {PeerMeetComponent} from './peer-meet.component'
import {ChatDialog, LinkifyPipe, StreamComponent} from './components'
import {
  SettingsDialog,
  AudioFrequencyDirective,
  AudioComponent,
  VideoComponent,
} from './components'
import { ReactiveFormsModule } from '@angular/forms'

@NgModule({
  imports: [
    CdkModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(peerMeetRoutes),
  ],
  declarations: [
    ChatDialog,
    LinkifyPipe,
    PeerMeetComponent,
    StreamComponent,
    SettingsDialog,
    AudioComponent,
    VideoComponent,
    AudioFrequencyDirective,
  ],
})
export class PeerMeetModule {}
