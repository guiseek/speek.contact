import {Component, inject} from '@angular/core'
import {Router} from '@angular/router'
import {AuthService} from '@speek/peer/data'
import {short} from '@speek/peer/utils'

@Component({
  selector: 'speek-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  auth = inject(AuthService)

  router = inject(Router)

  randomCode = short()
  placeholder = `Sugestão: ${this.randomCode}. -- Enter para usar a sugestão`

  createRoom(code = '') {
    const route = ['/', code == '' ? this.randomCode : code]
    this.router.navigate(route)
  }
}
