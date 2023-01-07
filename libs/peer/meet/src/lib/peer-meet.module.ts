import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {ReactiveFormsModule} from '@angular/forms'
import {CdkModule, MaterialModule} from '@speek/peer/shared/layout'
import {PeerMeetComponent} from './peer-meet.component'
import {FormatDeviceLabelPipe, FilterDevicesPipe} from './pipes'
import {SettingsComponent} from './settings/settings.component'
import {peerMeetRoutes} from './lib.routes'
import {
  ChatDialog,
  LinkifyPipe,
  StreamComponent,
  SettingsDialog,
  AudioComponent,
  VideoComponent,
  DevicesComponent,
  AudioFrequencyDirective,
} from './components'

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
    FilterDevicesPipe,
    SettingsComponent,
    DevicesComponent,
    FormatDeviceLabelPipe,
  ],
})
export class PeerMeetModule {}
