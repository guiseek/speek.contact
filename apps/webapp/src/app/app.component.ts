import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SignalingEvent } from '@speek/common-definitions';
import { AppConnection } from './app.connection';
import { AppSignaling } from './app.signaling';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'webapp';

  @ViewChild('local')
  localRef!: ElementRef<HTMLVideoElement>
  local!: HTMLVideoElement

  @ViewChild('remote')
  remoteRef!: ElementRef<HTMLVideoElement>
  remote!: HTMLVideoElement

  constructor(
    readonly signaling: AppSignaling,
    readonly connection: AppConnection
  ) {

    this.connection.onCandidate = (candidate) => {
      this.signaling.send(SignalingEvent.Candidate, candidate);
    }

    this.signaling.on(SignalingEvent.Offer, ({ id, offer }) => {
      if (this.signaling.id !== id) {
        this.connection.answer(offer).then((sdp) => {
          const answer = new RTCSessionDescription(sdp);
          this.signaling.send(SignalingEvent.Answer, answer);
        });
      }
    });

    this.signaling.on(SignalingEvent.Answer, ({ id, answer }) => {
      if (this.signaling.id !== id) {
        this.connection.setRemote(answer);
      }
    })

  }

  ngAfterViewInit(): void {
    this.local = this.localRef.nativeElement
    this.remote = this.remoteRef.nativeElement

    this.connection.onTrack = (stream) => {
      this.remote.srcObject = stream;
    }

    navigator.mediaDevices.getUserMedia({
      video: true, audio: true
    }).then(stream => {
      this.local.srcObject = stream;
      this.local.muted = true;

      this.connection.setTracks(stream);

      this.connection.create().then((sdp) => {
        const offer = new RTCSessionDescription(sdp);
        this.signaling.send(SignalingEvent.Offer, offer);
      });
    })
  }
}
