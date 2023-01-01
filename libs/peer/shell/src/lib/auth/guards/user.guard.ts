import {inject, Injectable} from '@angular/core'
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router'
import {AuthFacade} from '@speek/peer/data'
import {HttpErrorResponse} from '@speek/type'
import {catchError, map, take} from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  authFacade = inject(AuthFacade)
  router = inject(Router)

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authFacade.validate().pipe(
      map((response) => !!response),
      catchError((err, caught) => {
        if (err) {
          this.redirectToAuth(err, state)
        }
        return caught
      })
    )
  }

  redirectToAuth(err: HttpErrorResponse, {url}: RouterStateSnapshot) {
    if (err.status === 401) {
      this.router.navigate(['/auth'], {queryParams: {redirectTo: url}})
    }
    throw new Error(err.message)
  }
}
