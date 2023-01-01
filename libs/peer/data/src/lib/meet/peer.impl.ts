import {
  Callback,
  PeerMessage,
  PeerProgress,
  PeerUiState,
  PeerChatMessage,
} from '@speek/type'
import {long} from '@speek/peer/utils'
import {Signaling} from './ports/signaling'
import {TransferImpl} from './transfer.impl'
import {Socket} from './ports/socket'
import {Peer} from './ports/peer'
import {parse} from 'json5'

export class PeerImpl implements Peer {
  user: string
  meet?: string

  uiState: PeerUiState

  stream: MediaStream
  remote?: MediaStream

  conn: RTCPeerConnection

  private receiveMeta?: string
  receiveBuffer: ArrayBuffer[] = []
  receivedSize = 0

  private receiveChannel!: RTCDataChannel
  private sendChannel!: RTCDataChannel

  constructor(
    configuration: RTCConfiguration,
    private signaling: Signaling<Socket>,
    readonly constraints: MediaStreamConstraints
  ) {
    this.conn = new RTCPeerConnection(configuration)

    this.stream = new MediaStream()
    this.user = this.stream.id

    this.uiState = {
      audio: false,
      video: false,
    }
  }

  _onTrack: Callback<MediaStreamTrack>[] = []
  set onTrack(callback: Callback<MediaStreamTrack>) {
    this._onTrack.push(callback)
  }

  _onStream: Callback<MediaStream>[] = []
  set onStream(callback: Callback<MediaStream>) {
    this._onStream.push(callback)
  }

  _onSignalingChange: Callback<RTCSignalingState>[] = []
  set onSignalingChange(callback: Callback<RTCSignalingState>) {
    this._onSignalingChange.push(callback)
  }

  _onConnectionChange: Callback<RTCPeerConnectionState>[] = []
  set onConnectionChange(callback: Callback<RTCPeerConnectionState>) {
    this._onConnectionChange.push(callback)
  }

  _onIceCandidateChange: Callback<RTCIceCandidate>[] = []
  set onIceCandidateChange(callback: Callback<RTCIceCandidate>) {
    this._onIceCandidateChange.push(callback)
  }

  _onIceGatheringChange: Callback<RTCIceGatheringState>[] = []
  set onIceGatheringChange(callback: Callback<RTCIceGatheringState>) {
    this._onIceGatheringChange.push(callback)
  }

  _onIceConnectionChange: Callback<RTCPeerConnectionIceEvent>[] = []
  set onIceConnectionChange(callback: Callback<RTCPeerConnectionIceEvent>) {
    this._onIceConnectionChange.push(callback)
  }

  _onDataChannel: Callback<RTCDataChannel>[] = []
  set onDataChannel(callback: Callback<RTCDataChannel>) {
    this._onDataChannel.push(callback)
  }

  _onData: Callback<ArrayBuffer>[] = []
  set onData(callback: Callback<ArrayBuffer>) {
    this._onData.push(callback)
  }

  _onMessage: Callback<PeerChatMessage>[] = []
  set onMessage(callback: Callback<PeerChatMessage>) {
    this._onMessage.push(callback)
  }

  _onProgress: Callback<PeerProgress>[] = []
  set onProgress(callback: Callback<PeerProgress>) {
    this._onProgress.push(callback)
  }

  _onToggleAudio: Callback<boolean>[] = []
  set onToggleAudio(callback: Callback<boolean>) {
    this._onToggleAudio.push(callback)
  }

  _onToggleVideo: Callback<boolean>[] = []
  set onToggleVideo(callback: Callback<boolean>) {
    this._onToggleVideo.push(callback)
  }

  public connect(
    audio: MediaTrackConstraints,
    video: MediaTrackConstraints,
    meet?: string
  ) {
    if (meet) this.meet = meet

    this.signalUp(audio, video)
    this.waitData()
  }

  openChannel(fn: Callback<TransferImpl>) {
    const channel = this.conn.createDataChannel(long())
    channel.onopen = () => fn(new TransferImpl(channel))
  }

  async signalUp(audio: MediaTrackConstraints, video: MediaTrackConstraints) {
    await navigator.mediaDevices
      .getUserMedia({
        audio: {...this.constraints, deviceId: audio.deviceId},
        video: {...this.constraints, deviceId: video.deviceId},
      })
      .then((stream: MediaStream) => {
        this.stream = stream

        this._onStream.forEach((fn) => fn(stream))

        const [videoTrack] = this.stream.getVideoTracks()
        const [audioTrack] = this.stream.getAudioTracks()

        this.conn.addTrack(videoTrack)
        this.conn.addTrack(audioTrack)

        this.remote = new MediaStream()

        this.conn.ontrack = ({isTrusted, track}) => {
          if (this.remote && isTrusted && track) {
            this.remote.addTrack(track)
          }

          this._onTrack.forEach((fn) => fn(track))
        }

        this.conn.onicecandidate = this.getIceCandidate()

        this.conn.onconnectionstatechange = () => {
          this._onConnectionChange.forEach((cb) =>
            cb(this.conn.connectionState)
          )
        }

        this.conn
          .createOffer()
          .then(this.setDescription())
          .catch(this.errorHandler)
      })

    this.conn.onicecandidate = this.getIceCandidate()

    this.signaling.on('message', this.getSignalMessage())
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

  waitData() {
    this.conn.ondatachannel = ({channel}) => {
      this._onDataChannel.forEach((fn) => fn(channel))
      this.receiveChannel = channel

      this.receiveChannel.onmessage = ({data}) => {
        if (typeof data === 'string') {
          this.receiveMeta = data

          this._onMessage.forEach((fn) => fn(parse(data)))
        }

        if (data instanceof ArrayBuffer) {
          this.onReceiveMessageCallback(data)

          this._onData.forEach((fn) => fn(data))
        }
      }
    }

    this.sendChannel = this.conn.createDataChannel('sendDataChannel')
    this.sendChannel.onopen = () => {
      if (this.sendChannel.readyState === 'open') {
        this._onDataChannel.forEach((fn) => fn(this.sendChannel))
      }
    }
  }

  setDescription() {
    return (description: RTCSessionDescriptionInit) => {
      this.conn.setLocalDescription(description).then(() => {
        this.signaling.emit('message', {
          sdp: this.conn.localDescription,
          meet: `${this.meet}`,
          user: this.user,
        })
      })
    }
  }

  getSignalMessage() {
    return async ({user, sdp, ice}: PeerMessage) => {
      if (user === this.user) return

      if (sdp) {
        await this.conn.setRemoteDescription(sdp)
        if (sdp.type === 'offer') {
          this.conn.createAnswer().then(this.setDescription())
        }
      } else if (ice) {
        this.conn.addIceCandidate(ice).catch(this.errorHandler)

        this._onIceCandidateChange.forEach((fn) => fn(ice))
      }
    }
  }

  getIceCandidate() {
    return (event: RTCPeerConnectionIceEvent) => {
      this._onIceConnectionChange.forEach((fn) => fn(event))

      if (event.candidate != null) {
        this.signaling.emit('message', {
          ice: event.candidate,
          meet: `${this.meet}`,
          user: this.user,
        })
      }
    }
  }

  public send(message: string) {
    if (this.sendChannel.readyState === 'open') {
      this.sendChannel.send(message)
    }
  }

  public sendMessage<T extends PeerChatMessage>(message: T) {
    if (this.sendChannel.readyState === 'open') {
      this.sendChannel.send(JSON.stringify(message))
    }
  }

  public upload(file: File) {
    this.sendChannel.binaryType = 'arraybuffer'

    const chunkSize = 16384
    const fileReader = new FileReader()
    let offset = 0

    fileReader.onload = ({target}) => {
      const result = target?.result as ArrayBuffer

      if (offset === 0) {
        this.send(`${file.name};${file.size}`)
      }

      this.sendChannel.send(result)

      offset += result.byteLength

      this._onProgress.forEach((fn) =>
        fn({
          byteLength: result.byteLength,
          percent: this.getPercentage(offset, file.size),
          offset,
        })
      )

      if (offset < file.size) {
        readSlice(offset)
      } else {
        const progress = {byteLength: 0, percent: 0, offset: 0}
        this._onProgress.forEach((fn) => fn(progress))
      }
    }

    const readSlice = (o: number) => {
      const slice = file.slice(offset, o + chunkSize)
      fileReader.readAsArrayBuffer(slice)
    }

    readSlice(0)
  }

  onReceiveMessageCallback(data: ArrayBuffer) {
    this.receiveBuffer.push(data)
    this.receivedSize += data.byteLength

    let name = ''

    if (this.receiveMeta) {
      const meta = this.receiveMeta?.split(';')
      const [filename, size] = meta ? meta : []

      this._onProgress.forEach((fn) =>
        fn({
          percent: this.getPercentage(this.receivedSize, +size),
          byteLength: data.byteLength,
          offset: this.receivedSize,
        })
      )

      name = filename
    }
    if (data.byteLength < 16384) {
      const received = new Blob(this.receiveBuffer)

      this.receiveBuffer = []
      this.receivedSize = 0

      const link = document.createElement('a')
      link.href = URL.createObjectURL(received)
      link.download = name
      link.click()

      delete this.receiveMeta

      const progress = {byteLength: 0, percent: 0, offset: 0}
      this._onProgress.forEach((fn) => fn(progress))
    }
  }

  getPercentage(offset: number, total: number) {
    return (offset / total) * 100
  }

  toggleAudio(stream: MediaStream) {
    const tracks = stream.getAudioTracks()
    tracks.forEach((t) => (t.enabled = !t.enabled))
    this.uiState.audio = !this.uiState.audio

    const events = this._onToggleAudio
    events.forEach((fn) => fn(this.uiState.audio))
  }

  toggleVideo(stream: MediaStream) {
    const tracks = stream.getVideoTracks()
    tracks.forEach((t) => (t.enabled = !t.enabled))

    this.uiState.video = !this.uiState.video

    const events = this._onToggleVideo
    events.forEach((fn) => fn(this.uiState.video))
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

// import {short} from '@speek/peer/utils'
// import {Callback} from '@speek/type'
// import {Signaling} from './ports/signaling'
// import {Socket} from './ports/socket'
// import {Peer} from './ports/peer'

// export class PeerImpl implements Peer {
//   meet: string
//   user: string
//   stream = new MediaStream()
//   remote = new MediaStream()
//   conn: RTCPeerConnection

//   constructor(
//     configuration: RTCConfiguration,
//     private signaling: Signaling<Socket>,
//     readonly constraints: MediaStreamConstraints
//   ) {
//     this.conn = new RTCPeerConnection(configuration)
//     const meet = location.hash.replace('#/', '')
//     console.log(meet)

//     this.meet = meet ? meet : short()
//     this.user = this.stream.id
//   }

//   private _onTrack: Callback<MediaStreamTrack>[] = []
//   set onTrack(callback: Callback<MediaStreamTrack>) {
//     this._onTrack.push(callback)
//   }

//   private _onChannel: Callback<RTCDataChannel>[] = []
//   set onChannel(callback: Callback<RTCDataChannel>) {
//     this._onChannel.push(callback)
//   }

//   async connect(constraints = this.constraints) {
//     this.stream = await navigator.mediaDevices.getUserMedia(constraints)
//     const [videoTrack] = this.stream.getVideoTracks()
//     const [audioTrack] = this.stream.getAudioTracks()

//     this.conn.addTrack(videoTrack)
//     this.conn.addTrack(audioTrack)

//     this.conn.ontrack = ({isTrusted, track}) => {
//       if (this.remote && isTrusted && track) {
//         console.log(track);

//         this.remote.addTrack(track)
//         this._onTrack.forEach((cb) => cb(track))
//       }
//     }

//     this.conn.onicecandidate = ({candidate}) => {
//       if (candidate) {
//         console.log(candidate);

//         this.signaling.emit('candidate', {
//           ice: candidate,
//           meet: this.meet,
//           user: this.user,
//         })
//       }
//     }

//     this.conn.ondatachannel = ({channel}) => {
//       this._onChannel.forEach((cb) => cb(channel))
//     }

//     const sdp = await this.conn.createOffer()
//     await this.conn.setLocalDescription(sdp)
//     if (this.conn.localDescription) {
//       this.signaling.emit('offer', {
//         sdp: this.conn.localDescription,
//         meet: this.meet,
//         user: this.user,
//       })
//     }

//     this.signaling.on('offer', async ({sdp, meet, user}) => {
//       if (user !== this.user && meet === this.meet) {
//         await this.conn.setRemoteDescription(sdp)
//         this.conn.createAnswer().then(async (sdp) => {
//           await this.conn.setLocalDescription(sdp)
//           if (this.conn.localDescription) {
//             this.signaling.emit('answer', {
//               sdp: this.conn.localDescription,
//               meet: this.meet,
//               user: this.user,
//             })
//           }
//         })
//       }
//     })

//     this.signaling.on('answer', async ({sdp, meet, user}) => {
//       if (user !== this.user && meet === this.meet) {
//         await this.conn.setRemoteDescription(sdp)
//       }
//     })

//     this.signaling.on('candidate', async ({ice, meet, user}) => {
//       if (user !== this.user && meet === this.meet) {
//         await this.conn.addIceCandidate(ice)
//       }
//     })
//   }

//   toggleVideo(stream: MediaStream): void {
//     console.log(stream)
//   }

//   toggleAudio(stream: MediaStream): void {
//     console.log(stream)
//   }

//   close(): void {
//     const tracks = this.stream.getTracks()
//     tracks.forEach((t) => t.stop())
//     this.conn.close()
//   }
// }
