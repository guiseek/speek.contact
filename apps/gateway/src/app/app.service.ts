import { map } from 'rxjs/operators';
import { Contact } from './entities/contact.entity';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { interval } from 'rxjs';

@Injectable()
export class AppService {
  private contacts: Map<User['user'], User>;

  constructor() {
    this.contacts = new Map([]);
  }

  on({ user }: User) {
    if (!this.contacts.has(user)) {

    }
  }

  getData(): { message: string } {
    return { message: 'Welcome to gateway!' };
  }

  createPing({ to }: Pick<Contact, 'to'>) {
    return interval(5000).pipe(
      map((ping) => {
        return { data: { to, ping } };
      })
    );
  }
}
