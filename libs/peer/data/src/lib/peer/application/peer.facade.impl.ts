import {fromEvent} from 'rxjs'
import {State} from '@speek/data'
import {SubAsync} from '@speek/utils'
import {PeerMessage} from '@speek/type'
import {PeerFacade} from '../ports/peer.facade'
import {SignalingService} from '../ports/signaling.service'

interface PeerState {
  code: string | null
  stream: MediaStream
  sender: RTCDataChannel | null
  channel: RTCDataChannel | null
}

export class PeerFacadeImpl extends State<PeerState> implements PeerFacade {
  code$ = this.select((state) => state.code)
  stream$ = this.select((state) => state.stream)
  sender$ = this.filter(
    (state) => !!state.sender,
    (state) => state.sender
  )
  channel$ = this.filter(
    (state) => !!state.channel,
    (state) => state.channel
  )

  peer: RTCPeerConnection
  videoElement: HTMLVideoElement

  sub = new SubAsync()

  constructor(
    configuration: RTCConfiguration,
    private service: SignalingService
  ) {
    super({
      code: null,
      stream: new MediaStream(),
      sender: null,
      channel: null,
    })
    this.peer = new RTCPeerConnection(configuration)
    this.videoElement = document.createElement('video')
    this.videoElement.poster = '/assets/images/video.svg'
    this.videoElement.classList.add('video-element')
    this.videoElement.autoplay = true
  }

  loadConnection(stream: MediaStream, meet: string, user: string): void {
    stream.getTracks().forEach((track) => {
      this.peer.addTrack(track, stream)
    })

    this.sub.async = fromEvent<RTCTrackEvent>(this.peer, 'track').subscribe(
      this.addTrack()
    )

    this.sub.async = fromEvent<RTCPeerConnectionIceEvent>(
      this.peer,
      'icecandidate'
    ).subscribe(this.loadCandidate(meet, user))

    this.peer
      .createOffer()
      .then(this.setDescription(meet, user))
      .catch(this.catchError)

    this.service.on('message', this.loadSignalMessage(meet, user))

    this.setState({code: `${meet}-${user}`})
  }

  loadChannel(code: string) {
    this.setState({sender: this.peer.createDataChannel(code)})

    const createChannel = ({channel}: RTCDataChannelEvent) => {
      this.setState({channel})
    }

    this.sub.async = fromEvent<RTCDataChannelEvent>(
      this.peer,
      'datachannel'
    ).subscribe(createChannel)
  }

  addTrack() {
    return ({isTrusted, track}: RTCTrackEvent) => {
      const {stream} = this.state
      if (isTrusted && track) {
        stream.addTrack(track)
        this.setState({stream})
      }
    }
  }

  setDescription(meet: string, user: string) {
    return (description: RTCSessionDescriptionInit) => {
      this.peer.setLocalDescription(description).then(() => {
        this.service.emit('message', {
          sdp: this.peer.localDescription,
          meet: `${meet}`,
          user: `${user}`,
        })
      })
    }
  }

  loadSignalMessage(meet: string, localUser: string) {
    return async ({user, sdp, ice}: PeerMessage) => {
      if (user === localUser) return

      if (sdp) {
        if (this.peer.signalingState !== 'stable') {
          await this.peer.setRemoteDescription(sdp)
        }
        if (sdp.type === 'offer') {
          this.peer.restartIce()
          await this.peer
            .createAnswer()
            .then(this.setDescription(meet, localUser))
        }
      } else if (ice) {
        this.peer.addIceCandidate(ice).catch(this.catchError)
      }
    }
  }

  loadCandidate(meet: string, user: string) {
    return (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate != null) {
        this.service.emit('message', {
          ice: event.candidate,
          meet: `${meet}`,
          user: `${user}`,
        })
      }
    }
  }

  catchError(error: RTCPeerConnectionIceErrorEvent): void {
    console.error(error)
  }

  close(): void {
    this.peer.close()
  }
}
