import { Injectable } from "@angular/core";
import { AppConfig } from "./app.config";

@Injectable()
export class AppConnection {
  conn: RTCPeerConnection;

  onCandidate!: (candidate: RTCIceCandidate) => void;

  onTrack!: (candidate: MediaStream) => void;

  constructor(readonly config: AppConfig) {
    this.conn = new RTCPeerConnection(this.config.webrtc);

    this.conn.onsignalingstatechange = (ev) => {
      console.log('signalingChange: ', this.conn.signalingState);
      console.log('signalingChange: ', this.conn.connectionState);
    }

    this.conn.onicecandidate = ({ candidate }) => {
      if (!!this.onCandidate && candidate) {
        this.onCandidate(candidate)
      }
    }

    this.conn.ontrack = ({ streams }) => {
      if (!!this.onTrack) {
        this.onTrack(streams[0]);
      }
    }
  }

  setRemote(description: RTCSessionDescription) {
    this.conn.setRemoteDescription(description);
  }

  setTracks(stream: MediaStream) {
    const [audio] = stream.getAudioTracks();
    const [video] = stream.getVideoTracks();
    this.conn.addTrack(audio, stream);
    this.conn.addTrack(video, stream);
  }

  async create(options?: RTCOfferOptions) {
    return this.conn.createOffer(options)
      .then(sdp => {
        this.conn.setLocalDescription(sdp);
        return sdp;
      })
  }

  async answer(offer: RTCSessionDescription, options?: RTCOfferOptions) {
    return this.conn.setRemoteDescription(offer).then(() => {
      return this.conn.createAnswer(options)
        .then(sdp => {
          this.conn.setLocalDescription(sdp);
          return sdp;
        })
    })
  }
}
