import {short} from '@speek/peer/utils'
import {Signaling} from '../ports/signaling'
import {Socket} from '../interfaces/socket'
import {Peer} from '../ports/peer'
import {SignalEvent} from '../interfaces/signal-event'
import {Callback} from '../interfaces/callback'

export class PeerImpl implements Peer {
  stream = new MediaStream()
  remote = new MediaStream()
  conn: RTCPeerConnection
  call: string
  user: string

  constructor(
    configuration: RTCConfiguration,
    private signaling: Signaling<Socket>,
    readonly constraints: MediaStreamConstraints
  ) {
    this.conn = new RTCPeerConnection(configuration)
    const call = location.hash.replace('#/', '')
    console.log(call)

    this.call = call ? call : short()
    this.user = this.stream.id
  }

  private _onStream: Callback<MediaStream>[] = []
  set onStream(callback: Callback<MediaStream>) {
    this._onStream.push(callback)
  }

  private _onTrack: Callback<RTCTrackEvent>[] = []
  set onTrack(callback: Callback<RTCTrackEvent>) {
    this._onTrack.push(callback)
  }

  private _onChannel: Callback<RTCDataChannel>[] = []
  set onChannel(callback: Callback<RTCDataChannel>) {
    this._onChannel.push(callback)
  }

  connect(constraints = this.constraints) {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      const [videoTrack] = stream.getVideoTracks()
      const [audioTrack] = stream.getAudioTracks()

      console.log(videoTrack);

      this.stream = stream

      this.conn.addTrack(videoTrack)
      this.conn.addTrack(audioTrack)

      this._onStream.forEach((callback) => callback(this.stream))

      this.conn.ontrack = (trackEvent) => {
        console.log(trackEvent)
        if (trackEvent.isTrusted && trackEvent.track) {
          this.remote.addTrack(trackEvent.track)
          this._onTrack.forEach((callback) => callback(trackEvent))
        }
      }

      this.conn.onicecandidate = (iceEvent) => {
        if (iceEvent.candidate) {
          this.signaling.emit(SignalEvent.Message, {
            ice: iceEvent.candidate,
            user: this.user,
            call: this.call,
          })
        }
      }

      const channel = this.conn.createDataChannel(this.call)

      this.conn.ondatachannel = ({channel}) => {
        this._onChannel.forEach((callback) => callback(channel))
      }

      this.conn.createOffer().then((description) => {
        this.conn.setLocalDescription(description).then(() => {
          this.signaling.emit(SignalEvent.Message, {
            sdp: description,
            user: this.user,
            call: this.call,
          })
        })
      })

      this.signaling.on(SignalEvent.Message, async (message) => {
        if (message.user === this.user) return

        if (message.sdp) {
          if (message.sdp.type === 'offer') {
            if (this.conn.signalingState === 'have-local-offer') {
              await this.conn.setRemoteDescription(
                new RTCSessionDescription(message.sdp)
              )
            }

            if (
              this.conn.signalingState === 'have-remote-offer' ||
              this.conn.signalingState === 'have-local-pranswer'
            ) {
              this.conn.createAnswer().then(async (description) => {
                await this.conn.setLocalDescription(description)

                this.signaling.emit(SignalEvent.Message, {
                  sdp: description,
                  user: this.user,
                  call: this.call,
                })
              })
            }
          }
          if (message.sdp.type === 'answer') {
            const states = [
              'have-local-offer',
              'have-remote-offer',
              'have-local-pranswer',
            ]
            if (states.includes(this.conn.signalingState)) {
              this.conn.setRemoteDescription(
                new RTCSessionDescription(message.sdp)
              )
            }
          }
        } else if (message.ice) {
          this.conn.addIceCandidate(new RTCIceCandidate(message.ice))
        }
      })
    })
  }

  toggleVideo(stream: MediaStream) {
    const tracks = stream.getVideoTracks()
    tracks.forEach((t) => (t.enabled = !t.enabled))
  }

  toggleAudio(stream: MediaStream) {
    const tracks = stream.getAudioTracks()
    tracks.forEach((t) => (t.enabled = !t.enabled))
  }

  close() {
    const tracks = this.stream.getTracks()
    tracks.forEach((t) => t.stop())
    this.conn.close()
  }
}
