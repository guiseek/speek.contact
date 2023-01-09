import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {ReactiveFormsModule} from '@angular/forms'
import {CdkModule, MaterialModule} from '@speek/peer/shared/layout'
import {FormatDeviceLabelPipe, FilterDevicesPipe, LinkifyPipe} from './pipes'
import {AudioFrequencyDirective} from './directives'
import {PeerMeetComponent} from './peer-meet.component'
import {LobbyComponent} from './lobby/lobby.component'
import {peerMeetRoutes} from './lib.routes'
import {
  ChatDialog,
  StreamComponent,
  AudioConstraintsComponent,
  VideoConstraintsComponent,
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
    AudioFrequencyDirective,
    FilterDevicesPipe,
    FormatDeviceLabelPipe,
    AudioConstraintsComponent,
    VideoConstraintsComponent,
    LobbyComponent,
  ],
})
export class PeerMeetModule {}
