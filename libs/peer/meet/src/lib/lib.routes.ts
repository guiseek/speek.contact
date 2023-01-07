import {Route} from '@angular/router'
import {SettingsGuard} from './guards/settings.guard'
import {PeerMeetComponent} from './peer-meet.component'
import {SettingsComponent} from './settings/settings.component'

export const peerMeetRoutes: Route[] = [
  {path: 'settings', component: SettingsComponent},
  {path: 'meet', canActivate: [SettingsGuard], component: PeerMeetComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'settings'},
]
