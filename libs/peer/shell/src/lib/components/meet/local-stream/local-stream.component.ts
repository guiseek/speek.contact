import {
  Input,
  Output,
  Component,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core'
import {PeerUiState} from '@speek/type'

@Component({
  selector: 'speek-local-stream',
  templateUrl: './local-stream.component.html',
  styleUrls: ['./local-stream.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalStreamComponent {
  @Input() state: PeerUiState = {
    audio: false,
    video: false,
  }

  @Input() stream?: MediaStream

  @Output() toggleVideo = new EventEmitter<MediaStream>()

  @Output() toggleAudio = new EventEmitter<MediaStream>()

  panelOpenState = true
}
