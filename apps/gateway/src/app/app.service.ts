import { Injectable } from '@nestjs/common';
import { ObjectId } from '@speek/common-definitions';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AppService {
  contacts = new BehaviorSubject<ObjectId[]>([]);
  contacts$ = this.contacts.asObservable();

  add(data: ObjectId) {
    const{ value } = this.contacts;
    value.push(data);
    this.contacts.next(value);
  }
}
