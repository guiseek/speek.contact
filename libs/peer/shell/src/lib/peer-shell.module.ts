import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {ReactiveFormsModule} from '@angular/forms'
import {OverlayModule} from '@angular/cdk/overlay'
import {DialogModule} from '@angular/cdk/dialog'
import {LayoutModule} from '@angular/cdk/layout'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatButtonModule} from '@angular/material/button'
import {MatTooltipModule} from '@angular/material/tooltip'
import {MatDialogModule} from '@angular/material/dialog'
import {MatTabsModule} from '@angular/material/tabs'
import {MatMenuModule} from '@angular/material/menu'
import {MatSelectModule} from '@angular/material/select'
import {MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card'
import {PeerShellComponent} from './peer-shell.component'
import {SettingsDialog} from './components/settings/settings.dialog'
import {AudioComponent} from './components/settings/audio.component'
import {VideoComponent} from './components/settings/video.component'
import {peerShellRoutes} from './lib.routes'
import {DevicesComponent} from './components/settings/devices/devices.component'
import {StorageService} from './services/storage.service'
import {MeetComponent} from './containers/meet/meet.component'
import {HomeComponent} from './containers/home/home.component'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(peerShellRoutes),
    OverlayModule,
    DialogModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatTabsModule,
    MatMenuModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
  declarations: [
    PeerShellComponent,
    SettingsDialog,
    AudioComponent,
    VideoComponent,
    DevicesComponent,
    MeetComponent,
    HomeComponent,
  ],
  providers: [
    {
      provide: Storage,
      useValue: localStorage,
    },
    {
      provide: StorageService,
      useClass: StorageService,
      deps: [Storage],
    },
  ],
})
export class PeerShellModule {}
