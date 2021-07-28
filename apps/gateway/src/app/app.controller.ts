import { ContactMessageEvent, ObjectId } from '@speek/common-definitions';
import { Body, Controller, Post, Sse } from '@nestjs/common';
import { filter, map } from 'rxjs/operators';
import { AppService } from './app.service';
import { Observable } from 'rxjs';



@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @Post('contact')
  contact(@Body() data: ObjectId) {
    this.appService.add(data);
  }

  @Sse('ping')
  pong(): Observable<ContactMessageEvent> {
    return this.appService.contacts$.pipe(map((data) => ({ data })));
  }
}
