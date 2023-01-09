import {Route} from '@angular/router'
import {LobbyGuard} from './guards/lobby.guard'
import {LobbyComponent} from './lobby/lobby.component'
import {PeerMeetComponent} from './peer-meet.component'

export const peerMeetRoutes: Route[] = [
  {path: 'lobby', component: LobbyComponent},
  {path: 'meet', canActivate: [LobbyGuard], component: PeerMeetComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'lobby'},
]
