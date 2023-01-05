import {inject, OnInit, Component, OnDestroy} from '@angular/core'
import {AuthFacade, UserFacade} from '@speek/peer/data'
import {SubAsync} from '@speek/utils'
import {UserForm} from './forms/user.form'

@Component({
  selector: 'peer-user',
  templateUrl: './peer-user.component.html',
  styleUrls: ['./peer-user.component.scss'],
})
export class PeerUserComponent implements OnInit, OnDestroy {
  auth = inject(AuthFacade)
  user = inject(UserFacade)

  form = new UserForm()

  sub = new SubAsync()

  ngOnInit() {
    this.sub.async = this.auth.user$.subscribe((user) => {
      if (user) this.user.loadOneById(user.id)
      this.sub.async = this.user.user$.subscribe((user) => {
        if (user) this.form.patchValue(user)
      })
    })
  }

  onSubmit() {
    if (this.form.valid) {
      this.user.updateUser(this.form.value)
    }
  }

  ngOnDestroy() {
    this.sub.unsub()
  }
}
