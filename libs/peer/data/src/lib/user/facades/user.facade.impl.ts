import {HttpErrorResponse, UpdateUser, UserResponse} from '@speek/type'
import {State} from '@speek/data'
import {catchError, take} from 'rxjs'
import {UserFacade} from '../ports/user.facade'
import {UserService} from '../ports/user.service'

interface UserState {
  loading: boolean
  error: string | null
  user: UserResponse | null
}

const initialValue: UserState = Object.freeze({
  loading: false,
  error: null,
  user: null,
})

export class UserFacadeImpl extends State<UserState> implements UserFacade {
  loading$ = this.select((state) => state.loading)
  error$ = this.select((state) => state.error)
  user$ = this.select((state) => state.user)

  constructor(private userService: UserService) {
    super(initialValue)
  }

  loadOneById(id: number): void {
    this.setState({loading: true})
    this.userService
      .findOneById(id)
      .pipe(take(1), catchError(this.throwError))
      .subscribe((user) => {
        this.setState({user, loading: false})
      })
  }

  updateUser(user: UpdateUser): void {
    this.setState({loading: true})
    this.userService
      .update(user.id, user)
      .pipe(take(1), catchError(this.throwError))
      .subscribe((user) => {
        this.setState({user, loading: false})
      })
  }

  throwError = <T>(err: HttpErrorResponse, caught: T) => {
    if (err && err.error) {
      this.setState({error: err.error.message})
      throw err
    }
    return caught
  }
}
