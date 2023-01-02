import {BehaviorSubject, Subject} from 'rxjs'
import {PeerMessage, PeerUiState, PeerDirection} from '@speek/type'
import {Signaling} from './ports/signaling'
import {TransferImpl} from './transfer.impl'
import {Transfer} from './ports/transfer'
import {Socket} from './ports/socket'
import {Peer} from './ports/peer'

export class PeerImpl implements Peer {
  user?: string
  meet?: string

  uiState: PeerUiState = {
    audio: false,
    video: false,
  }

  stream = new MediaStream()
  remote?: MediaStream

  conn: RTCPeerConnection

  constructor(
    configuration: RTCConfiguration,
    private signaling: Signaling<Socket>,
    readonly constraints: MediaStreamConstraints
  ) {
    this.conn = new RTCPeerConnection(configuration)
  }

  private _track = new Subject<MediaStreamTrack>()
  readonly track$ = this._track.asObservable()

  private _stream = new Subject<MediaStream>()
  readonly stream$ = this._stream.asObservable()

  private _dataChannel = new Subject<RTCDataChannel>()
  readonly dataChannel$ = this._dataChannel.asObservable()

  private _transfer = new BehaviorSubject<
    Record<PeerDirection, Transfer | null>
  >({
    sender: null,
    receiver: null,
  })
  readonly transfer$ = this._transfer.asObservable()

  public connect(
    audio: MediaTrackConstraints,
    video: MediaTrackConstraints,
    meet?: string
  ) {
    if (meet) this.meet = meet

    this.signaling.on('connection', ({user}) => {
      this.user = user
      this.signalUp(audio, video)
      this.waitData()
    })
  }

  async signalUp(audio: MediaTrackConstraints, video: MediaTrackConstraints) {
    await navigator.mediaDevices
      .getUserMedia({
        audio: {...this.constraints, deviceId: audio.deviceId},
        video: {...this.constraints, deviceId: video.deviceId},
      })
      .then((stream: MediaStream) => {
        this.stream = stream

        this._stream.next(stream)

        const [videoTrack] = this.stream.getVideoTracks()
        const [audioTrack] = this.stream.getAudioTracks()

        this.conn.addTrack(videoTrack)
        this.conn.addTrack(audioTrack)

        this.remote = new MediaStream()

        this.conn.ontrack = ({isTrusted, track}) => {
          if (this.remote && isTrusted && track) {
            this.remote.addTrack(track)
            this._track.next(track)
          }
        }

        this.conn.onicecandidate = this.getIceCandidate()

        this.conn
          .createOffer()
          .then(this.setDescription())
          .catch(this.errorHandler)
      })

    this.conn.onicecandidate = this.getIceCandidate()

    this.signaling.on('message', this.getSignalMessage())
  }

  waitData() {
    const sender = this.conn.createDataChannel(`${this.meet}-${this.user}`)
    this.conn.ondatachannel = ({channel}) => {
      console.log(channel)
      this._transfer.next({
        sender: new TransferImpl(sender),
        receiver: new TransferImpl(channel),
      })
    }
  }

  async replaceTrack(
    audio: MediaTrackConstraints,
    video: MediaTrackConstraints
  ) {
    const [videoTrack] = this.stream.getVideoTracks()
    const [audioTrack] = this.stream.getAudioTracks()

    const senderVideo = this.conn
      .getSenders()
      .find(({track}) => track?.kind === videoTrack.kind)

    const senderAudio = this.conn
      .getSenders()
      .find(({track}) => track?.kind === audioTrack.kind)

    this.stream = await this.getStream(audio, video)

    const [newVideoTrack] = this.stream.getVideoTracks()
    if (senderVideo) senderVideo.replaceTrack(newVideoTrack)

    const [newAudioTrack] = this.stream.getAudioTracks()
    if (senderAudio) senderAudio.replaceTrack(newAudioTrack)
  }

  getStream(audio: MediaTrackConstraints, video: MediaTrackConstraints) {
    return navigator.mediaDevices.getUserMedia({
      audio: {...this.constraints, deviceId: audio.deviceId},
      video: {...this.constraints, deviceId: video.deviceId},
    })
  }

  setDescription() {
    return (description: RTCSessionDescriptionInit) => {
      this.conn.setLocalDescription(description).then(() => {
        this.signaling.emit('message', {
          sdp: this.conn.localDescription,
          meet: `${this.meet}`,
          user: `${this.user}`,
        })
      })
    }
  }

  getSignalMessage() {
    return async ({user, sdp, ice}: PeerMessage) => {
      if (user === this.user) return

      if (sdp) {
        if (this.conn.signalingState !== 'stable') {
          await this.conn.setRemoteDescription(sdp)
        }
        if (sdp.type === 'offer') {
          this.conn.restartIce()
          await this.conn.createAnswer().then(this.setDescription())
        }
      } else if (ice) {
        this.conn.addIceCandidate(ice).catch(this.errorHandler)
      }
    }
  }

  getIceCandidate() {
    return (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate != null) {
        this.signaling.emit('message', {
          ice: event.candidate,
          meet: `${this.meet}`,
          user: `${this.user}`,
        })
      }
    }
  }

  toggleAudio(stream: MediaStream) {
    const tracks = stream.getAudioTracks()
    tracks.forEach((t) => (t.enabled = !t.enabled))
    this.uiState.audio = !this.uiState.audio
  }

  toggleVideo(stream: MediaStream) {
    const tracks = stream.getVideoTracks()
    tracks.forEach((t) => (t.enabled = !t.enabled))

    this.uiState.video = !this.uiState.video
  }

  errorHandler(error: RTCPeerConnectionIceErrorEvent): void {
    console.error(error)
  }

  close() {
    const tracks = this.stream.getTracks()
    tracks.forEach((t) => t.stop())
    this.conn.close()
  }
}
