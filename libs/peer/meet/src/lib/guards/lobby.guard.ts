import {Injectable} from '@angular/core'
import {
  Router,
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router'
import {MediaService} from '@speek/peer/data'
import {of} from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class LobbyGuard implements CanActivate {
  constructor(readonly service: MediaService, readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const constraints = this.service.getConstraints()
    const {meet} = route.params

    if (!meet) {
      return this.router.navigate(['/'])
    }

    if (!constraints) {
      return this.router.navigate([meet, 'lobbby'])
    }

    return of(true)
  }
}
