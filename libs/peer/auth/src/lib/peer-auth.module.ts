import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {MaterialModule} from '@speek/peer/shared/layout'
import {peerAuthRoutes} from './lib.routes'
import {PeerAuthComponent} from './peer-auth.component'
import {ReactiveFormsModule} from '@angular/forms'
import {
  CheckUserDirective,
  SignInComponent,
  SignUpComponent,
} from './components'

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(peerAuthRoutes),
  ],
  declarations: [
    PeerAuthComponent,
    SignInComponent,
    SignUpComponent,
    CheckUserDirective,
  ],
})
export class PeerAuthModule {}
