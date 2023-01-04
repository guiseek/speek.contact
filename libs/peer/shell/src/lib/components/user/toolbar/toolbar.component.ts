import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core'
import {Router} from '@angular/router'
import {AuthFacade} from '@speek/peer/data'
import {short} from '@speek/utils'

@Component({
  selector: 'speek-user-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserToolbarComponent {
  @Input() auth?: AuthFacade

  private router = inject(Router)

  initCall() {
    this.router.navigate(['/', short()])
  }
}
