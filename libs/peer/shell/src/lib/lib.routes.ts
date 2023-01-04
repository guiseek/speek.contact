import {Route} from '@angular/router'
import {PeerShellComponent} from './peer-shell.component'
import {HomeComponent} from './containers/home/home.component'
import {AuthComponent} from './containers/auth/auth.component'
import {MeetComponent} from './containers/meet/meet.component'
import {UserGuard} from './auth/guards/user.guard'
import {UserComponent} from './containers/user/user.component'

export const peerShellRoutes: Route[] = [
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'user',
    canActivate: [UserGuard],
    component: UserComponent,
  },
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
        canActivate: [UserGuard],
        component: MeetComponent,
      },
    ],
  },
]
