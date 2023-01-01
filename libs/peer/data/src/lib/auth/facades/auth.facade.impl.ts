import {filter, map, switchMap, take, tap} from 'rxjs'
import {
  AuthRequest,
  AuthResponse,
  AuthUserResponse,
  CreateUser,
} from '@speek/type'
import {State} from '@speek/data'
import {StorageService} from '../../base/storage.service'
import {AuthService} from '../ports/auth.service'
import {AuthFacade} from '../ports/auth.facade'

interface AuthState {
  user: AuthUserResponse | null
  isAuthenticated: boolean
  loading: boolean
}

export class AuthFacadeImpl extends State<AuthState> implements AuthFacade {
  loading$ = this.select((state) => state.loading)

  isAuthenticated$ = this.select((state) => state.isAuthenticated)

  user$ = this.select((state) => state.user).pipe(
    filter((user) => user !== null)
  )

  constructor(
    private authService: AuthService,
    private storage: StorageService
  ) {
    super({
      user: null,
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

  setAccessToken({accessToken}: AuthResponse) {
    this.storage.setItem('accessToken', accessToken)
  }

  getAccessToken() {
    this.storage.getItem('accessToken')
  }
}
