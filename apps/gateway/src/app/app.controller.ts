import { Controller, Get, Sse, Post, Body } from '@nestjs/common';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { Contact } from './entities/contact.entity';
import { map } from 'rxjs/operators';

import { AppService } from './app.service';


@Controller()
export class AppController {
  private _call: BehaviorSubject<Contact>;
  private call$: Observable<Contact>;

  constructor(private readonly appService: AppService) {
    this._call = new BehaviorSubject({ ping: true, to: '' });
  }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Sse('ping')
  ping(@Body() { to }: Pick<Contact, 'to'>) {
    return interval(5000).pipe(
      map((ping) => {
        return { data: { to, ping } };
      })
    );
  }

  @Post('call')
  call(@Body() contact: Contact) {
    return this.appService.getData();
  }

  @Sse('call')
  onCall() {}
}
