import {Route} from '@angular/router'
import {PeerShellComponent} from './peer-shell.component'
import {HomeComponent} from './containers/home/home.component'
import {MeetComponent} from './containers/meet/meet.component'

export const peerShellRoutes: Route[] = [
  {
    path: '',
    component: PeerShellComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: ':id',
        component: MeetComponent,
      },
    ],
  },
]
