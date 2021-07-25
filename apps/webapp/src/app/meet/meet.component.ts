import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Signaling } from '@speek/common-definitions';
import { Peer } from '@speek/common-adapters';
import { env } from '@speek/envs/webapp';

@Component({
  selector: 'app-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.css']
})
export class MeetComponent implements AfterViewInit {

  @ViewChild('local')
  localRef!: ElementRef<HTMLVideoElement>;
  local!: HTMLVideoElement;

  @ViewChild('remote')
  remoteRef!: ElementRef<HTMLVideoElement>;
  remote!: HTMLVideoElement;

  peer = new Peer(env.iceServers);

  constructor(private signaling: Signaling) {
    console.log(signaling);

    this.peer.on('iceCandidateChange', (candidate) => {
      if (candidate) {
        this.signaling.send('candidate', candidate);
      }
    });

    this.peer.on('connectionChange', (evt) => {
      console.log('connectionChange: ', evt);
    });

    this.peer.on('negotiation', (evt) => {
      if (
        this.peer.signaling !== 'have-remote-offer' &&
        this.peer.signaling !== 'stable'
      ) {
        this.peer.create().then((sdp) => {
          const offer = new RTCSessionDescription(sdp);
          this.signaling.send('offer', offer);
        });
      }
    });

    this.peer.on('signalingChange', (evt) => {
      console.log('signalingChange: ', evt);
    });

    this.signaling.on('offer', ({ id, offer }) => {
      if (this.signaling.id !== id) {
        console.log('signaling offer: ', id, offer);
        this.peer.answer(offer).then((sdp) => {
          const answer = new RTCSessionDescription(sdp);
          this.signaling.send('answer', answer);
        });
      }
    });

    this.signaling.on('answer', ({ id, answer }) => {
      if (this.signaling.id !== id) {
        console.log('signaling answer: ', id, answer);
        this.peer.setRemote(answer);
      }
    });
  }

  ngAfterViewInit(): void {
    this.local = this.localRef.nativeElement;
    this.remote = this.remoteRef.nativeElement;
    console.log(1);

    this.peer.on('track', (track) => {
      console.log('track: ', track);
      this.remote.srcObject = new MediaStream([track]);
    });

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        this.local.srcObject = stream;
        this.local.muted = true;

        this.peer.setTracks(stream);
        console.log(2);

        this.peer.create().then((sdp) => {
          const offer = new RTCSessionDescription(sdp);
          this.signaling.send('offer', offer);
        });
      });
  }

}
