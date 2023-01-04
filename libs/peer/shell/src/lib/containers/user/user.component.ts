import {
  inject,
  OnInit,
  Component,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core'
import {MediaMatcher} from '@angular/cdk/layout'
import {AuthFacade, UserFacade} from '@speek/peer/data'
import {SubAsync} from '@speek/utils'
import {SidenavContainer} from '../sidenav.container'
import {UserForm} from '../../user'

@Component({
  selector: 'speek-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent
  extends SidenavContainer
  implements OnInit, OnDestroy
{
  auth = inject(AuthFacade)
  user = inject(UserFacade)

  form = new UserForm()

  sub = new SubAsync()

  constructor(cdr: ChangeDetectorRef, media: MediaMatcher) {
    super(cdr, media)
  }

  ngOnInit() {
    this.sub.async = this.auth.user$.subscribe((user) => {
      if (user) this.user.loadOneById(user.id)
      this.sub.async = this.user.user$.subscribe((user) => {
        if (user) this.form.patchValue(user)
        console.log(user)
      })
    })
  }

  onSubmit() {
    console.log(this.form.valid)
    // console.log(this.form.value.birthday.toDateString())
    const { birthday } = this.form.value
    console.log(new Date(birthday));
    // console.log(new Intl.DateTimeFormat('en-US').format(birthday));
    // this.form.value.birthday = new Intl.DateTimeFormat('pt-BR').format(birthday).replace(/\//g, '-')
    if (this.form.valid) {
      this.user.updateUser(this.form.value)
    }
  }

  ngOnDestroy() {
    super.onDestroy()
    this.sub.unsub()
  }
}
