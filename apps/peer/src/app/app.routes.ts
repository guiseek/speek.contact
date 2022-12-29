import {ExtraOptions, Route} from '@angular/router'

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@speek/peer/shell').then((m) => m.PeerShellModule),
  },
]

export const appConfig: ExtraOptions = {
  initialNavigation: 'enabledBlocking',
  useHash: true,
}
