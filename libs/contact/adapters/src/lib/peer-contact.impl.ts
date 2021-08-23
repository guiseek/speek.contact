import {
  Socket,
  Callback,
  PeerEvent,
  PeerContact,
  PeerEventMap,
  SignalMessage,
  SignalContact,
  PeerEventCallback,
} from '@speek/contact/ports';

export class PeerContactImpl implements PeerContact {
  uuid: string;

  peer: RTCPeerConnection;

  stream: MediaStream;
  remote?: MediaStream;

  events: PeerEventCallback<PeerEvent>;

  constructor(
    configuration: RTCConfiguration,
    private signaling: SignalContact<Socket>
  ) {
    this.peer = new RTCPeerConnection(configuration);

    this.stream = new MediaStream();
    this.uuid = this.stream.id;

    this.events = new Map();
  }

  public on<K extends keyof PeerEventMap>(
    key: K,
    fn: Callback<PeerEventMap[K]>
  ): void {
    this.events.set(key, fn as () => void);
  }

  public connect(uuid?: string): void {
    if (uuid) {
      this.uuid = uuid;
    }

    this.signalUp();
    this.listen();
  }

  listen(): void {
    this.peer.onicecandidate = this.getIceCandidate();
  }

  async signalUp(): Promise<void> {
    await navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(this.gotStream());

    this.signaling.on('message', this.getSignalMessage());
  }

  gotStream(): (stream: MediaStream) => void {
    return (stream) => {
      this.stream = stream;

      const [videoTrack] = this.stream.getVideoTracks();
      const [audioTrack] = this.stream.getAudioTracks();

      this.peer.addTrack(videoTrack);
      this.peer.addTrack(audioTrack);

      this.remote = new MediaStream();

      this.peer.ontrack = ({ isTrusted, track }) => {

        const onTrackEvent = this.events.get('track')
        if (onTrackEvent) onTrackEvent(track)

        if (this.remote && isTrusted && track) {
          this.remote.addTrack(track);
        }
      };

      this.peer
        .createOffer()
        .then(this.setDescription())
        .catch(this.errorHandler);
    };
  }

  setDescription(): (description: RTCSessionDescriptionInit) => void {
    return (description) => {

      this.peer.setLocalDescription(description).then(() => {
        const message = { sdp: this.peer.localDescription, uuid: this.uuid };
        this.signaling.emit('message', message);
      });
    };
  }

  errorHandler(error: Event): void {
    console.log(error);
  }

  getSignalMessage(): (message: SignalMessage) => void {
    return ({ uuid, sdp, ice }) => {
      if (uuid === this.uuid) {
        return;
      }

      if (sdp) {

        this.peer
          .setRemoteDescription(new RTCSessionDescription(sdp))
          .then(() => {
            if (sdp.type === 'offer') {
              this.peer
                .createAnswer()
                .then(this.setDescription())
                .catch(this.errorHandler);
            }
          })
          .catch(this.errorHandler);
      } else if (ice) {

        const onCandidateEvent = this.events.get('iceCandidateChange')
        if (onCandidateEvent) onCandidateEvent(ice)

        this.peer
          .addIceCandidate(new RTCIceCandidate(ice))
          .catch(this.errorHandler);
      }
    };
  }

  getIceCandidate(): (event: RTCPeerConnectionIceEvent) => void {
    return (event) => {

      const onIceConnectionEvent = this.events.get('iceConnectionChange')
      if (onIceConnectionEvent) onIceConnectionEvent(event)

      if (event.candidate != null) {
        const message = { ice: event.candidate, uuid: this.uuid };
        this.signaling.emit('message', message);
      }
    };
  }

  toggleAudio(stream: MediaStream) {
    const tracks = stream.getAudioTracks();
    tracks.forEach((t) => t.enabled = !t.enabled);
  }

  toggleVideo(stream: MediaStream) {
    const tracks = stream.getVideoTracks();
    tracks.forEach((t) => t.enabled = !t.enabled);
  }
}
