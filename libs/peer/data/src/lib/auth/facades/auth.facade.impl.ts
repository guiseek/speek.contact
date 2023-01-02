import {catchError, filter, map, switchMap, take, tap} from 'rxjs'
import {
  AuthRequest,
  AuthResponse,
  AuthUserResponse,
  CreateUser,
  HttpErrorResponse,
} from '@speek/type'
import {State} from '@speek/data'
import {StorageService} from '../../base/storage.service'
import {AuthService} from '../ports/auth.service'
import {AuthFacade} from '../ports/auth.facade'

interface AuthState {
  user: AuthUserResponse | null
  error: string | null
  isAuthenticated: boolean
  loading: boolean
}

export class AuthFacadeImpl extends State<AuthState> implements AuthFacade {
  loading$ = this.select((state) => state.loading)

  isAuthenticated$ = this.select((state) => state.isAuthenticated)

  error$ = this.select((state) => state.error)

  user$ = this.select((state) => state.user).pipe(
    filter((user) => user !== null)
  )

  constructor(
    private authService: AuthService,
    private storage: StorageService
  ) {
    super({
      user: null,
      error: null,
      isAuthenticated: false,
      loading: false,
    })
  }

  signIn(request: AuthRequest) {
    this.setState({loading: true})
    this.authService
      .login(request)
      .pipe(
        take(1),
        catchError(this.throwError),
        switchMap((response) => {
          this.setAccessToken(response)
          return this.authService.validateUser()
        })
      )
      .subscribe((user) => {
        this.setState({user, isAuthenticated: true, loading: false})
      })
  }

  signUp(createUser: CreateUser) {
    this.setState({loading: true})
    this.authService
      .createUser(createUser)
      .pipe(
        take(1),
        catchError(this.throwError),
        map(({username}) => {
          const {password} = createUser
          return {username, password}
        })
      )
      .subscribe((request) => {
        this.signIn(request)
        this.setState({loading: false})
      })
  }

  validate() {
    return this.authService.validateUser().pipe(
      take(1),
      tap((user) => {
        this.setState({user})
      })
    )
  }

  signOut() {
    this.storage.removeItem('accessToken')
  }

  throwError = <T>(err: HttpErrorResponse, caught: T) => {

    if (err && err.error) {
      console.log(err);
      this.setState({error: err.error.message})
      throw err
    }
    return caught
  }

  setAccessToken({accessToken}: AuthResponse) {
    this.storage.setItem('accessToken', accessToken)
  }

  getAccessToken() {
    this.storage.getItem('accessToken')
  }
}
