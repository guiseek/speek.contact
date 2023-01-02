import {AuthRequest, AuthUserResponse, CreateUser} from '@speek/type'
import {Observable} from 'rxjs'

export abstract class AuthFacade {
  abstract loading$: Observable<boolean>
  abstract isAuthenticated$: Observable<boolean>
  abstract error$: Observable<string | null>
  abstract user$: Observable<AuthUserResponse | null>

  abstract signIn(request: AuthRequest): void
  abstract signUp(request: CreateUser): void
  abstract signOut(): void

  abstract validate(): Observable<AuthUserResponse>
}
