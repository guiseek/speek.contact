import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {ReactiveFormsModule} from '@angular/forms'
import {OverlayModule} from '@angular/cdk/overlay'
import {DialogModule} from '@angular/cdk/dialog'
import {LayoutModule} from '@angular/cdk/layout'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatListModule} from '@angular/material/list'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatButtonModule} from '@angular/material/button'
import {MatTooltipModule} from '@angular/material/tooltip'
import {MatDialogModule} from '@angular/material/dialog'
import {MatExpansionModule} from '@angular/material/expansion'
import {MatTabsModule} from '@angular/material/tabs'
import {MatMenuModule} from '@angular/material/menu'
import {MatSelectModule} from '@angular/material/select'
import {MatIconModule, MatIconRegistry} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card'
import {PeerShellComponent} from './peer-shell.component'
import {SettingsDialog} from './components/settings/settings.dialog'
import {AudioComponent} from './components/settings/audio/audio.component'
import {VideoComponent} from './components/settings/video/video.component'
import {peerShellRoutes} from './lib.routes'
import {MeetComponent} from './containers/meet/meet.component'
import {HomeComponent} from './containers/home/home.component'
import {AudioFrequencyDirective} from './components/settings/audio/audio-frequency.directive'
import {ChatComponent} from './components/chat/chat.component'
import {DomSanitizer} from '@angular/platform-browser'
import {AuthComponent} from './containers/auth/auth.component'
import {SignInComponent} from './components/auth/sign-in/sign-in.component'
import {SignUpComponent} from './components/auth/sign-up/sign-up.component'
import {CheckUserDirective} from './components/auth/sign-up/check-user.directive'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(peerShellRoutes),
    OverlayModule,
    DialogModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatTabsModule,
    MatMenuModule,
    MatSelectModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
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
  ],
})
export class PeerShellModule {
  icons = [
    'add-r.svg',
    'add.svg',
    'assign.svg',
    'bookmark.svg',
    'captions.svg',
    'close-o.svg',
    'close-r.svg',
    'lock-unlock.svg',
    'lock.svg',
    'log-in.svg',
    'log-off.svg',
    'log-out.svg',
    'more-alt.svg',
    'more-o.svg',
    'more-r.svg',
    'more-vertical-alt.svg',
    'more-vertical-o.svg',
    'more-vertical-r.svg',
    'more-vertical.svg',
    'more.svg',
    'play-pause-o.svg',
    'play-pause-r.svg',
    'play-pause.svg',
    'play-stop-o.svg',
    'play-stop-r.svg',
    'play-stop.svg',
    'share.svg',
    'shortcut.svg',
    'software-download.svg',
    'software-upload.svg',
  ]
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    console.log(iconRegistry)
    this.icons.forEach((icon) => {
      iconRegistry.addSvgIcon(
        icon.replace('.svg', ''),
        sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/${icon}`)
      )
    })
  }
}
