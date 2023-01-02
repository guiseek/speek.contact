import {Test, TestingModule} from '@nestjs/testing'
import {MEET_PROVIDERS} from '../meet.providers'
import {MeetService} from '../ports/meet.service'

describe('MeetService', () => {
  let service: MeetService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...MEET_PROVIDERS],
    }).compile()

    service = module.get<MeetService>(MeetService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
