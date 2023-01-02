import {Provider} from '@nestjs/common'
import {MeetService} from './ports/meet.service'
import {MeetServiceImpl} from './services/meet.service.impl'

export const MEET_PROVIDERS: Provider<unknown>[] = [
  {
    provide: MeetService,
    useFactory: () => new MeetServiceImpl(),
  },
]
