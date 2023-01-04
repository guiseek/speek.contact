import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {AuthFacade} from '@speek/peer/data'

@Component({
  selector: 'speek-meet-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetToolbarComponent {
  @Input() auth?: AuthFacade
}
