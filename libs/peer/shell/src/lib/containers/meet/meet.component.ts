import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core'
import {Peer} from '@speek/peer/data'

@Component({
  selector: 'speek-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss'],
})
export class MeetComponent implements OnInit {
  @ViewChild('local')
  private videoLocalRef!: ElementRef<HTMLVideoElement>
  get videoLocal() {
    return this.videoLocalRef.nativeElement
  }

  @ViewChild('remote')
  private videoRemoteRef!: ElementRef<HTMLVideoElement>
  get videoRemote() {
    return this.videoRemoteRef.nativeElement
  }

  peer = inject(Peer)

  ngOnInit() {
    console.log(this.peer.call)

    this.peer.onStream = (stream) => {
      // this.videoLocal.srcObject = stream
      this.videoLocal.muted = true
    }

    this.peer.onTrack = (event) => {
      console.log(event)
      const stream = new MediaStream()
      stream.addTrack(event.track)
      this.videoRemote.srcObject = stream

      console.log(this.videoRemote.srcObject);

    }

    this.peer.onChannel = (channel) => {
      console.log(channel)
    }

    this.peer.connect()
  }
}
