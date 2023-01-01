import {BehaviorSubject, distinctUntilChanged, map, tap} from 'rxjs'
import {CheckUserResponse} from '@speek/type'
import {AuthService} from './auth.service'

export abstract class CheckUserValidator {
  abstract service: AuthService

  protected error = new BehaviorSubject<CheckUserResponse>({
    exists: false,
    message: '',
  })

  checkUser(username: string) {
    return this.service.checkUser({username}).pipe(
      distinctUntilChanged(),
      map(({exists, message}) => {
        this.error.next({exists, message})
        return exists ? {exists} : null
      })
    )
  }
}
