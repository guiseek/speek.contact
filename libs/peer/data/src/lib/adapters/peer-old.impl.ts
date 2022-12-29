import {SignalMessage} from '../interfaces/signal-message'
import {Socket} from '../interfaces/socket'
import {Peer} from '../ports/peer'
import {Signaling} from '../ports/signaling'
import {EventEmitterImpl} from './event-emitter.impl'

export class PeerImpl implements Peer {
  call: string
  user: string

  // uiState: PeerUiState;

  stream: MediaStream
  remote: MediaStream

  conn: RTCPeerConnection

  private receiveMeta?: string
  receiveBuffer: ArrayBuffer[] = []
  receivedSize = 0

  private receiveChannel!: RTCDataChannel
  private sendChannel!: RTCDataChannel

  event: EventEmitterImpl

  constructor(
    configuration: RTCConfiguration,
    private signaling: Signaling<Socket>
  ) {
    this.conn = new RTCPeerConnection(configuration)

    this.stream = new MediaStream()
    this.remote = new MediaStream()
    this.user = this.stream.id
    this.call = location.hash

    this.event = new EventEmitterImpl()

    // this.uiState = {
    //   audio: false,
    //   video: false,
    // };
  }

  public connect(constraints: MediaStreamConstraints): void {
    // if (id) this.id = id

    this.signalUp()
  }

  // openChannel(fn: (channel: DataTransferImpl) => void) {
  //   const channel = this.conn.createDataChannel(uuid());
  //   channel.onopen = () => {
  //     fn(new DataTransferImpl(channel));
  //   };
  // }

  async signalUp(): Promise<void> {
    await navigator.mediaDevices
      .getUserMedia(this.getConfig())
      .then(this.gotStream())

    this.conn.onicecandidate = this.getIceCandidate()

    this.signaling.on('message', (message) => {
      this.getSignalMessage()(message)
    })
  }

  getConfig() {
    let audio: string | Partial<MediaDeviceInfo> =
      localStorage.getItem('audio') ?? 'true'
    let video: string | Partial<MediaDeviceInfo> =
      localStorage.getItem('video') ?? 'true'

    if (audio) {
      const {deviceId} = JSON.parse(audio as string)
      audio = {deviceId}
    }
    if (video) {
      const {deviceId} = JSON.parse(video as string)
      video = {deviceId}
    }

    return {audio, video} as MediaStreamConstraints
  }

  gotStream(): (stream: MediaStream) => void {
    return (stream) => {
      this.stream = stream

      this.event.get('stream').map((fn) => fn(stream))

      const [videoTrack] = this.stream.getVideoTracks()
      const [audioTrack] = this.stream.getAudioTracks()

      this.conn.addTrack(videoTrack)
      this.conn.addTrack(audioTrack)

      this.remote = new MediaStream()

      this.conn.ontrack = ({isTrusted, track}) => {
        if (this.remote && isTrusted && track) {
          this.remote.addTrack(track)
        }

        this.event.get('track').map((fn) => fn(track))
      }

      this.conn
        .createOffer()
        .then(this.setDescription())
        .catch(this.errorHandler)
    }
  }

  setDescription(): (description: RTCSessionDescriptionInit) => void {
    return (description) => {
      this.conn.setLocalDescription(description).then(() => {
        const message = {
          sdp: this.conn.localDescription,
          call: this.call,
          user: this.user,
        }
        this.signaling.emit('message', message)
      })
    }
  }

  getSignalMessage(): (message: SignalMessage) => void {
    return ({user, sdp, ice}) => {
      if (user === this.user) {
        return
      }

      if (sdp) {
        this.conn
          .setRemoteDescription(new RTCSessionDescription(sdp))
          .then(() => {
            if (sdp.type === 'offer') {
              this.conn
                .createAnswer()
                .then(this.setDescription())
                .catch(this.errorHandler)
            }
          })
          .catch(this.errorHandler)
      } else if (ice) {
        this.conn
          .addIceCandidate(new RTCIceCandidate(ice))
          .catch(this.errorHandler)

        this.event.get('iceCandidateChange').map((fn) => fn(ice))
      }
    }
  }

  getIceCandidate(): (event: RTCPeerConnectionIceEvent) => void {
    return (event) => {
      this.event.get('iceConnectionChange').map((fn) => fn(event))

      if (event.candidate != null) {
        const message = {
          ice: event.candidate,
          call: this.call,
          user: this.user,
        }
        this.signaling.emit('message', message)
      }
    }
  }

  onConnectionChange(): (event: Event) => void {
    return ({currentTarget}: Event) => {
      const peer = currentTarget as RTCPeerConnection

      this.event.get('connectionChange').map((fn) => fn(peer.connectionState))
    }
  }

  public send(message: string): void {
    this.sendChannel.send(message)
  }

  toggleAudio(stream: MediaStream) {
    const tracks = stream.getAudioTracks()
    tracks.forEach((t) => (t.enabled = !t.enabled))
    // this.uiState.audio = !this.uiState.audio;

    const events = this.event.get('toggleAudio')
    // events.map((fn) => fn(this.uiState.audio));
  }

  toggleVideo(stream: MediaStream) {
    const tracks = stream.getVideoTracks()
    tracks.forEach((t) => (t.enabled = !t.enabled))

    // this.uiState.video = !this.uiState.video;

    const events = this.event.get('toggleVideo')
    // events.map((fn) => fn(this.uiState.video));
  }

  // toggle(stream: MediaStream, kind: keyof PeerUiState = 'video') {
  //   let tracks: MediaStreamTrack[];

  //   if (kind === 'video') {
  //     tracks = stream.getVideoTracks();
  //   } else {
  //     tracks = stream.getAudioTracks();
  //   }

  //   tracks.forEach((t) => (t.enabled = !t.enabled));

  //   this.uiState[kind] = !this.uiState[kind];
  // }

  errorHandler(error: RTCPeerConnectionIceErrorEvent): void {
    console.error(error)
  }

  close() {
    const tracks = this.stream.getTracks()
    tracks.forEach((t) => t.stop())
    this.conn.close()
  }
}
