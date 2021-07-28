import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Inject } from '@angular/core';
import { Contact, Peer, Signaling } from '@speek/common-definitions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'webapp';


  constructor(
    private http: HttpClient,
    private signaling: Signaling,
    private contact: Contact,
    private peer: Peer,
  ) {
    console.log(signaling);
    console.log(contact);
    console.log(peer);
  }

  ngAfterViewInit(): void {
    const eventSource = new EventSource('/gateway/ping');
    eventSource.onmessage = console.debug
  }

  ping() {
    this.http.post('/gateway/contact', { id: this.signaling.id })
      .subscribe(console.log);
  }
}
