import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {ReactiveFormsModule} from '@angular/forms'
import {MaterialModule} from '@speek/peer/shared/layout'
import {peerUserRoutes} from './lib.routes'
import {PeerUserComponent} from './peer-user.component'

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(peerUserRoutes),
  ],
  declarations: [PeerUserComponent],
})
export class PeerUserModule {}
