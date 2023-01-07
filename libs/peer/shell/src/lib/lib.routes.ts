import {Route} from '@angular/router'
import {PeerShellComponent} from './peer-shell.component'
import {HomeComponent} from './home/home.component'
import {UserGuard} from './guards/user.guard'

export const peerShellRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: () =>
      import('@speek/peer/auth').then((m) => m.PeerAuthModule),
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '',
    component: PeerShellComponent,
    canActivate: [UserGuard],
    children: [
      {
        path: 'user',
        loadChildren: () =>
          import('@speek/peer/user').then((m) => m.PeerUserModule),
      },
      {
        path: ':meet',
        loadChildren: () =>
          import('@speek/peer/meet').then((m) => m.PeerMeetModule),
      },
    ],
  },
]
