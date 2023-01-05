import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {CdkModule, MaterialModule} from '@speek/peer/shared/layout'
import {peerMeetRoutes} from './lib.routes'
import {PeerMeetComponent} from './peer-meet.component'
import {ChatDialog, LinkifyPipe, StreamComponent} from './components'

@NgModule({
  imports: [
    CdkModule,
    CommonModule,
    MaterialModule,
    RouterModule.forChild(peerMeetRoutes),
  ],
  declarations: [ChatDialog, LinkifyPipe, PeerMeetComponent, StreamComponent],
})
export class PeerMeetModule {}
