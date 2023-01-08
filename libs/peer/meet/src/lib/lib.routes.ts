import {Route} from '@angular/router'
import {LobbyGuard} from './guards/lobby.guard'
import {SettingsGuard} from './guards/settings.guard'
import {LobbyComponent} from './lobby/lobby.component'
import {PeerMeetComponent} from './peer-meet.component'
import {SettingsComponent} from './settings/settings.component'

export const peerMeetRoutes: Route[] = [
  {path: 'lobby', component: LobbyComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'meet', canActivate: [LobbyGuard], component: PeerMeetComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'lobby'},
]
