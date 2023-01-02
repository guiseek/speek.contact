import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {ReactiveFormsModule} from '@angular/forms'
import {MaterialModule} from './shared/material.module'
import {CdkModule} from './shared/cdk.module'
import {PeerShellComponent} from './peer-shell.component'
import {MeetComponent, HomeComponent, AuthComponent} from './containers'
import {peerShellRoutes} from './lib.routes'
// prettier-ignore
import {SettingsDialog, AudioFrequencyDirective, AudioComponent, VideoComponent, SignInComponent, SignUpComponent, CheckUserDirective, ToolbarComponent, LocalStreamComponent, ChatDialog} from './components';
import {LinkifyPipe} from './components/meet/chat/linkify.pipe'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(peerShellRoutes),
    CdkModule,
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
    AuthComponent,
    SignInComponent,
    SignUpComponent,
    CheckUserDirective,
    ToolbarComponent,
    LocalStreamComponent,
    ChatDialog,
    LinkifyPipe,
  ],
})
export class PeerShellModule {}
