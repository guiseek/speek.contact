import {Directive, inject} from '@angular/core'
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms'
import {AuthService, CheckUserValidator} from '@speek/peer/data'
import {filter} from 'rxjs'

@Directive({
  exportAs: 'peerCheckUser',
  selector: '[peerCheckUser]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: CheckUserDirective,
      multi: true,
    },
  ],
})
export class CheckUserDirective
  extends CheckUserValidator
  implements AsyncValidator
{
  service = inject(AuthService)

  message$ = this.error.asObservable()

  isAvailable$ = this.error
    .asObservable()
    .pipe(filter(({exists}) => exists === false))

  alreadyExists$ = this.error
    .asObservable()
    .pipe(filter(({exists}) => exists === true))

  validate(control: AbstractControl) {
    return this.checkUser(control.value)
  }
}
