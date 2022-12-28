import {Signaling} from '../ports/signaling'
import {Socket} from '../interfaces/socket'
import {Peer} from '../ports/peer'

function short() {
  const base = 'xxxxxxxx'
  return base.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export class PeerImpl implements Peer {
  id = short()
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

  connect(constraints = this.constraints) {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      const [videoTrack] = stream.getVideoTracks()
      const [audioTrack] = stream.getAudioTracks()

      this.conn.addTrack(videoTrack)
      this.conn.addTrack(audioTrack)

      this.conn.ontrack = (trackEvent) => {
        if (trackEvent.isTrusted && trackEvent.track) {
          this.remote.addTrack(trackEvent.track)
        }
      }

      this.conn.onicecandidate = (iceEvent) => {
        if (iceEvent.candidate) {
          this.signaling.emit('message', {
            ice: iceEvent.candidate,
            id: this.id,
          })
        }
      }

      this.conn.createOffer().then((description) => {
        this.conn.setLocalDescription(description).then(() => {
          this.signaling.emit('message', {
            sdp: description,
            id: this.id,
          })
        })
      })

      this.signaling.on('message', (message) => {
        if (message.id === this.id) return

        if (message.sdp) {
          this.conn.setRemoteDescription(message.sdp).then(() => {
            if (message.sdp.type === 'offer') {
              this.conn.createAnswer().then((description) => {
                this.conn.setLocalDescription(description)
              })
            }
          })
        } else if (message.ice) {
          this.conn.addIceCandidate(message.ice)
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
