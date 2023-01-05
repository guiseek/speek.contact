import {Component, inject, OnDestroy} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {AuthRequest, CreateUser} from '@speek/type'
import {AuthFacade} from '@speek/peer/data'
import {SubAsync} from '@speek/utils'

// type AuthParams = Record<'action', 'in' | 'up'>
interface AuthParams {
  action?: 'in' | 'up'
  redirectTo?: string
}

@Component({
  selector: 'peer-auth',
  templateUrl: './peer-auth.component.html',
  styleUrls: ['./peer-auth.component.scss'],
})
export class PeerAuthComponent implements OnDestroy {
  sub = new SubAsync()

  router = inject(Router)
  route = inject(ActivatedRoute)

  auth = inject(AuthFacade)

  get queryParams() {
    return this.route.snapshot.queryParams as AuthParams
  }

  actions = ['in', 'up']
  get actionIndex() {
    const {action = 'in'} = this.queryParams
    const validAction = this.actions.includes(action)
    return validAction ? this.actions.indexOf(action) : 0
  }

  onSignIn<T extends AuthRequest>(value: T) {
    this.auth.signIn(value)

    this.sub.async = this.auth.isAuthenticated$.subscribe((state) => {
      if (state) this.redirect()
    })
  }

  onSignUp<T extends CreateUser>(value: T) {
    this.auth.signUp(value)

    this.sub.async = this.auth.isAuthenticated$.subscribe((state) => {
      if (state) this.redirect()
    })
  }

  onTabChange() {
    const form = document.querySelector('form')
    if (form) this.getInputOfForm(form).focus()
  }

  getInputOfForm(form: HTMLFormElement) {
    return form.querySelector(`[autofocus]`) as HTMLInputElement
  }

  redirect() {
    const {redirectTo = '/'} = this.queryParams
    this.router.navigateByUrl(redirectTo)
  }

  ngOnDestroy() {
    this.sub.unsub()
  }
}
