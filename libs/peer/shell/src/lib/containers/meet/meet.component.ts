import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core'

@Component({
  selector: 'speek-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss'],
})
export class MeetComponent implements OnInit, AfterViewInit {
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

  #localStream: MediaStream
  #remoteStream: MediaStream

  #signaling = new BroadcastChannel('webrtc')

  #peer
  constructor() {
    this.#localStream = new MediaStream()
    this.#remoteStream = new MediaStream()
    this.#peer = new RTCPeerConnection({
      iceServers: [],
    })
  }

  ngOnInit() {
    this.#signaling.onmessage = (e) => {
      if (!this.#localStream) {
        console.log('not ready yet')
        return
      }

      switch (e.data.type) {
        case 'offer':
          this.#handleOffer(e.data)
          break
        case 'answer':
          this.#handleAnswer(e.data)
          break
        case 'candidate':
          this.#handleCandidate(e.data)
          break
        case 'ready':
          // A second tab joined. This tab will initiate a call unless in a call already.
          if (this.#peer) {
            console.log('already in call, ignoring')
            return
          }
          this.#makeCall()
          break
        case 'bye':
          if (this.#peer) {
            this.#hangup()
          }
          break
        default:
          console.log('unhandled', e)
          break
      }
    }
  }

  async ngAfterViewInit() {
    console.log()

    this.#localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })
    this.videoLocal.srcObject = this.#localStream
    this.#signaling.postMessage({type: 'ready'})
  }

  async #handleCandidate(candidate: RTCIceCandidate) {
    // if (!this.#peer) {
    //   console.error('no peerconnection');
    //   return;
    // }

    if (!candidate.candidate) {
      await this.#peer.addIceCandidate(undefined)
    } else {
      await this.#peer.addIceCandidate(candidate)
    }
  }

  async #handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.#peer) {
      console.error('no peerconnection')
      return
    }
    await this.#peer.setRemoteDescription(answer)
  }

  async #handleOffer(offer: RTCSessionDescriptionInit) {
    // if (this.#peer) {
    //   console.error('existing peerconnection');
    //   return;
    // }
    await this.#createPeerConnection()

    await this.#peer.setRemoteDescription(offer)

    const answer = await this.#peer.createAnswer()
    this.#signaling.postMessage({type: 'answer', sdp: answer.sdp})
    await this.#peer.setLocalDescription(answer)
  }

  async #makeCall() {
    await this.#createPeerConnection()

    const offer = await this.#peer.createOffer()
    this.#signaling.postMessage({type: 'offer', sdp: offer.sdp})
    await this.#peer.setLocalDescription(offer)
  }

  async #createPeerConnection() {
    this.#peer = new RTCPeerConnection()
    this.#peer.onicecandidate = (e) => {
      const message: {
        type: 'candidate'
        candidate: RTCIceCandidate | null
        sdpMid: string | null
        sdpMLineIndex: number | null
      } = {
        type: 'candidate',
        candidate: null,
        sdpMid: null,
        sdpMLineIndex: null,
      }
      if (e.candidate) {
        const candidate = new RTCIceCandidate(e.candidate)
        message.candidate = candidate
        message.sdpMid = candidate.sdpMid
        message.sdpMLineIndex = candidate.sdpMLineIndex
      }
      this.#signaling.postMessage(message)
    }
    this.#peer.ontrack = (e) => (this.videoRemote.srcObject = e.streams[0])
    this.#localStream
      .getTracks()
      .forEach((track) => this.#peer.addTrack(track, this.#localStream))
  }

  #hangup() {
    if (this.#peer) {
      this.#peer.close()
      // this.#peer = null;
    }
    this.#localStream.getTracks().forEach((track) => track.stop())
    // this.#localStream = null;
    // this.#startButton.disabled = false;
    // this.#hangupButton.disabled = true;
  }
}
