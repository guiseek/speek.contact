import {MeetService} from './meet.service'

export abstract class MeetGateway {
  constructor(private readonly meetService: MeetService) {}
}
