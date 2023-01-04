import {UpdateUser, UserResponse} from '@speek/type'
import {Observable} from 'rxjs'

export abstract class UserFacade {
  abstract loading$: Observable<boolean>
  abstract error$: Observable<string | null>
  abstract user$: Observable<UserResponse | null>

  abstract loadOneById(id: number): void
  abstract updateUser(user: UpdateUser): void
}
