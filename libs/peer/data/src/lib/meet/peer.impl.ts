import {BehaviorSubject} from 'rxjs'
import {PeerMessage, PeerUiState, PeerDirection} from '@speek/type'
import {Signaling} from './ports/signaling'
import {TransferImpl} from './transfer.impl'
import {Transfer} from './ports/transfer'
import {Socket} from './ports/socket'
import {Peer} from './ports/peer'

export class PeerImpl implements Peer {
  uiState: PeerUiState = {
    audio: false,
    video: false,
  }

  stream = new MediaStream()
  remote = new MediaStream()

  conn: RTCPeerConnection

  constructor(
    configuration: RTCConfiguration,
    private signaling: Signaling<Socket>,
    readonly constraints: MediaStreamConstraints
  ) {
    this.conn = new RTCPeerConnection(configuration)
  }

  private _transfer = new BehaviorSubject<
    Record<PeerDirection, Transfer | null>
  >({
    sender: null,
    receiver: null,
  })
  readonly transfer$ = this._transfer.asObservable()

  public connect(stream: MediaStream, meet: string, user: string) {
    this.stream = stream

    this.stream.getTracks().forEach((track) => {
      this.conn.addTrack(track, this.stream)
    })

    this.conn.ontrack = ({isTrusted, track}) => {
      if (isTrusted && track) this.remote.addTrack(track)
    }

    this.conn.onicecandidate = this.getIceCandidate(meet, user)

    this.conn
      .createOffer()
      .then(this.setDescription(meet, user))
      .catch(this.errorHandler)

    this.conn.onicecandidate = this.getIceCandidate(meet, user)

    this.signaling.on('message', this.getSignalMessage(meet, user))

    const sender = this.conn.createDataChannel(`${meet}-${user}`)
    this.conn.ondatachannel = ({channel}) => {
      this._transfer.next({
        sender: new TransferImpl(sender),
        receiver: new TransferImpl(channel),
      })
    }
  }

  replaceTrack(oldStream: MediaStream, newStream: MediaStream) {
    const [videoTrack] = oldStream.getVideoTracks()
    const [audioTrack] = oldStream.getAudioTracks()

    const senderVideo = this.conn.getSenders().find(({track}) => {
      return track?.kind === videoTrack.kind
    })
    const senderAudio = this.conn.getSenders().find(({track}) => {
      return track?.kind === audioTrack.kind
    })

    const [newVideoTrack] = newStream.getVideoTracks()
    const [newAudioTrack] = newStream.getAudioTracks()

    if (senderVideo) senderVideo.replaceTrack(newVideoTrack)
    if (senderAudio) senderAudio.replaceTrack(newAudioTrack)
  }

  // async replaceTrack(
  //   audio: MediaTrackConstraints,
  //   video: MediaTrackConstraints
  // ) {
  //   const [videoTrack] = this.stream.getVideoTracks()
  //   const [audioTrack] = this.stream.getAudioTracks()

  //   const senderVideo = this.conn
  //     .getSenders()
  //     .find(({track}) => track?.kind === videoTrack.kind)

  //   const senderAudio = this.conn
  //     .getSenders()
  //     .find(({track}) => track?.kind === audioTrack.kind)

  //   this.stream = await this.getStream(audio, video)

  //   const [newVideoTrack] = this.stream.getVideoTracks()
  //   if (senderVideo) senderVideo.replaceTrack(newVideoTrack)

  //   const [newAudioTrack] = this.stream.getAudioTracks()
  //   if (senderAudio) senderAudio.replaceTrack(newAudioTrack)
  // }

  // getStream(audio: MediaTrackConstraints, video: MediaTrackConstraints) {
  //   return navigator.mediaDevices.getUserMedia({
  //     audio: {...this.constraints, deviceId: audio.deviceId},
  //     video: {...this.constraints, deviceId: video.deviceId},
  //   })
  // }

  setDescription(meet: string, user: string) {
    return (description: RTCSessionDescriptionInit) => {
      this.conn.setLocalDescription(description).then(() => {
        this.signaling.emit('message', {
          sdp: this.conn.localDescription,
          meet: `${meet}`,
          user: `${user}`,
        })
      })
    }
  }

  getSignalMessage(meet: string, localUser: string) {
    return async ({user, sdp, ice}: PeerMessage) => {
      if (user === localUser) return

      if (sdp) {
        if (this.conn.signalingState !== 'stable') {
          await this.conn.setRemoteDescription(sdp)
        }
        if (sdp.type === 'offer') {
          this.conn.restartIce()
          await this.conn
            .createAnswer()
            .then(this.setDescription(meet, localUser))
        }
      } else if (ice) {
        this.conn.addIceCandidate(ice).catch(this.errorHandler)
      }
    }
  }

  getIceCandidate(meet: string, user: string) {
    return (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate != null) {
        this.signaling.emit('message', {
          ice: event.candidate,
          meet: `${meet}`,
          user: `${user}`,
        })
      }
    }
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
