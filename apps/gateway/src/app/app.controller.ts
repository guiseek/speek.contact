import { Controller, Get, Sse, Post, Body } from '@nestjs/common';
import { BehaviorSubject, interval, Observable, of } from 'rxjs';
import { Contact } from './entities/contact.entity';
import { map } from 'rxjs/operators';

import { AppService } from './app.service';

export interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}

@Controller()
export class AppController {
  private _call: BehaviorSubject<Contact>;
  private call$: Observable<Contact>;

  constructor(private readonly appService: AppService) {
    this._call = new BehaviorSubject({ ping: true, to: '' });
  }

  @Sse('ping')
  ping() {
    return interval(5000).pipe(
      map((ping) => {
        return { data: { ping, date: new Date() } };
      })
    );
  }

  @Post('pong')
  pong(@Body() { from }: Pick<Contact, 'from'>) {
    console.log(from);
    return this.appService.createPing({ to: from })
  }

  @Sse('call')
  onCall() {
    return interval(1000).pipe(
      map((ping) => {
        return { data: 'data' };
      })
    );
  }
}
