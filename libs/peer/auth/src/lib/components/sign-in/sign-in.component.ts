import {Component, EventEmitter, Output} from '@angular/core'
import {FormGroup, FormControl, Validators} from '@angular/forms'
import {AuthRequest} from '@speek/type'
import {SignComponent, SignForm} from '../sign.component'

@Component({
  selector: 'peer-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../sign.component.scss'],
})
export class SignInComponent extends SignComponent<AuthRequest> {
  @Output() sign = new EventEmitter<AuthRequest>()

  form = new FormGroup<SignForm<AuthRequest>>({
    username: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(6)],
    }),
  })
}
