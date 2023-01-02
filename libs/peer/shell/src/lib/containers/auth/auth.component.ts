import {Component, inject, OnDestroy} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {AuthFacade, StorageService} from '@speek/peer/data'
import {AuthRequest, CreateUser} from '@speek/type'
import {SubAsync} from '@speek/utils'

@Component({
  selector: 'speek-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnDestroy {
  links = [
    {path: '/auth/sign/in', label: 'In'},
    {path: '/auth/sign/up', label: 'Up'},
  ]
  sub = new SubAsync()

  router = inject(Router)
  route = inject(ActivatedRoute)

  auth = inject(AuthFacade)

  storage = inject(StorageService)

  get queryParams() {
    return this.route.snapshot.queryParams
  }

  onSignIn<T extends AuthRequest>(value: T) {
    this.auth.signIn(value)

    this.sub.async = this.auth.isAuthenticated$.subscribe((state) => {
      if (state) {
        const {redirectTo = '/'} = this.queryParams
        this.router.navigateByUrl(redirectTo)
      }
    })
  }

  onSignUp<T extends CreateUser>(value: T) {
    this.auth.signUp(value)

    this.sub.async = this.auth.isAuthenticated$.subscribe((state) => {
      if (state) {
        const {redirectTo = '/'} = this.queryParams
        this.router.navigateByUrl(redirectTo)
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsub()
  }
}
