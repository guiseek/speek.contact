import {MediaMatcher} from '@angular/cdk/layout'
import {inject, Component, OnDestroy, ChangeDetectorRef} from '@angular/core'
import {AuthFacade} from '@speek/peer/data'
import {BaseSidenavContainer} from '@speek/peer/shared/layout'

@Component({
  selector: 'speek-peer-shell',
  templateUrl: './peer-shell.component.html',
  styleUrls: ['./peer-shell.component.scss'],
})
export class PeerShellComponent
  extends BaseSidenavContainer
  implements OnDestroy
{
  auth = inject(AuthFacade)

  constructor(cdr: ChangeDetectorRef, media: MediaMatcher) {
    super(cdr, media)
  }

  ngOnDestroy() {
    super.onDestroy()
  }
}
