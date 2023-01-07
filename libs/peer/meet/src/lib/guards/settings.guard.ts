import {Injectable} from '@angular/core'
import {
  Router,
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router'
import {StorageService} from '@speek/peer/data'
import {LocalSettings} from '@speek/type'
import {of} from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class SettingsGuard implements CanActivate {
  constructor(
    readonly storage: StorageService<LocalSettings>,
    readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const audioInput = this.storage.getItem('audioinput')
    const {meet} = route.params

    if (!meet) {
      return this.router.navigate(['/'])
    }

    if (!audioInput) {
      return this.router.navigate([meet, 'settings'])
    }

    return of(true)
  }
}
