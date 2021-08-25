import { PeerContact, SignalContact, Socket } from '@speek/contact/ports';
import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss'],
})
export class MeetComponent implements AfterViewInit {

  constructor(
    readonly route: ActivatedRoute,
    readonly peerContact: PeerContact,
    private signalContact: SignalContact<Socket>,
  ) {

  }

  async ngAfterViewInit() {
  }
}
