import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {ReactiveFormsModule} from '@angular/forms'
import {OverlayModule} from '@angular/cdk/overlay'
import {DialogModule} from '@angular/cdk/dialog'
import {LayoutModule} from '@angular/cdk/layout'
import {MaterialModule} from './shared/material.module'
import {PeerShellComponent} from './peer-shell.component'
import {MeetComponent, HomeComponent, AuthComponent} from './containers'
import {peerShellRoutes} from './lib.routes'
// prettier-ignore
import {SettingsDialog, AudioFrequencyDirective, AudioComponent, VideoComponent, ChatComponent, SignInComponent, SignUpComponent, CheckUserDirective, ToolbarComponent, LocalStreamComponent} from './components'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(peerShellRoutes),
    OverlayModule,
    DialogModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [
    PeerShellComponent,
    SettingsDialog,
    AudioComponent,
    VideoComponent,
    MeetComponent,
    HomeComponent,
    AudioFrequencyDirective,
    ChatComponent,
    AuthComponent,
    SignInComponent,
    SignUpComponent,
    CheckUserDirective,
    ToolbarComponent,
    LocalStreamComponent,
  ],
})
export class PeerShellModule {}
