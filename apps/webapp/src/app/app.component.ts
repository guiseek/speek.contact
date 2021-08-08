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
    private peer: Peer
  ) {
    console.log(signaling);
    console.log(contact);
    console.log(peer);


    signaling.on('offer', ({ id, data }) => {
      console.log(peer.connection);
      console.log(peer.signaling);
      peer.setRemote(new RTCSessionDescription(data))
      if (
        peer.signaling === 'have-local-offer' ||
        peer.signaling === 'have-remote-offer' ||
        peer.signaling === 'have-local-pranswer'
      ) {
        peer.answer(data).then((answer) => {
          signaling.send('answer', new RTCSessionDescription(answer));
        });
      }
    });
    signaling.on('answer', ({ id, data }) => {
      if (data.type === 'answer') {
        console.log(data);
        peer.setRemote(data);
      }
    });
    peer.create().then((sdp) => {
      console.log(sdp);
      signaling.send('offer', sdp);
    });
    peer.on('negotiation', (ev) => {
      console.log(ev);

    })
  }

  ngAfterViewInit(): void {
    const eventSource = new EventSource('/gateway/ping');
    eventSource.onmessage = console.debug;
  }

  ping() {
    this.http
      .post('/gateway/contact', { id: this.signaling.id })
      .subscribe(console.log);
  }
}
