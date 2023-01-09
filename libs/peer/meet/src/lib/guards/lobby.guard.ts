import {Injectable} from '@angular/core'
import {Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router'
import {MediaService} from '@speek/peer/data'
import {of} from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class LobbyGuard implements CanActivate {
  constructor(readonly service: MediaService, readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const {meet} = route.params
    if (!meet) {
      return this.router.navigate(['/'])
    }

    const constraints = this.service.getConstraints()
    if (!constraints) {
      return this.router.navigate([meet, 'lobbby'])
    }

    return of(true)
  }
}
