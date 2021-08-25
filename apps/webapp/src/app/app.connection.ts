import { ICE_SERVERS } from './../providers/ice-servers.provider';
import { Inject, Injectable } from '@angular/core';
import { env } from '@speek/envs/webapp';

export type PeerEventMap = {
  iceCandidate: RTCIceCandidate;
  'local-offer': RTCSessionDescription;
  'remote-offer': RTCSessionDescription;
  iceGatheringState: RTCIceGatheringState;
};

export type ConnectionEventMap = {
  /**
   * A nova mídia de entrada foi negociada para um
   * determinado RTCRtpReceivere esse receptor track foi
   * adicionado a quaisquer MediaStreams remotos associados.
   */
  track: RTCTrackEvent;

  /**
   * O navegador deseja informar ao aplicativo que
   * a negociação da sessão precisa ser feita, ou seja,
   * Um createOffer seguido por setLocalDescription.
   */
  negotiationNeeded: Event;

  /**
   * O estado de sinalização mudou. Essa mudança
   * de estado é o resultado de um setLocalDescriptionou
   * de setRemoteDescriptionser invocado.
   */
  signalingStateChange: Event;

  /**
   * O RTCPeerConnection's estado da conexão ICE mudou.
   */
  iceConnectionStateChange: Event;

  /**
   * O RTCPeerConnection's estado encontro ICE mudou.
   */
  iceGatheringStateChange: Event;

  /**
   * Um novo RTCIceCandidateé disponibilizado para o script.
   */
  iceCandidate: RTCPeerConnectionIceEvent;

  /**
   * A RTCPeerConnection. connectionState mudou.
   */
  connectionStateChange: Event;

  /**
   * Ocorreu uma falha ao reunir candidatos ICE.
   */
  iceCandidateError: RTCPeerConnectionIceErrorEvent;

  /**
   * Um novo RTCDataChannelé despachado para o script
   * em resposta ao outro par criando um canal.
   */
  dataChannel: RTCDataChannelEvent;
};

export type Callback<T> = (value: T) => void;

export type ConnectionEventMapped<K extends keyof ConnectionEventMap> = Map<
  K,
  Callback<ConnectionEventMap[K]>
>;

@Injectable()
export class AppConnection {
  conn: RTCPeerConnection;

  onCandidate!: (candidate: RTCIceCandidate) => void;

  onTrack!: (candidate: MediaStream) => void;

  private readonly events: ConnectionEventMapped<any>;

  get state() {
    return this.conn.connectionState;
  }
  get signal() {
    return this.conn.signalingState;
  }

  constructor(
    @Inject(ICE_SERVERS) private readonly iceServers: RTCIceServer[]
  ) {
    this.conn = new RTCPeerConnection({ iceServers: this.iceServers });

    this.events = new Map();

    this.conn.onicegatheringstatechange = (ev) => {
      const event = this.events.get('iceGatheringStateChange');
      if (event) event(ev);
      if (!env.production) {
        console.log('icegatheringstatechange: ', ev);
      }
    };

    this.conn.onicecandidateerror = (ev) => {
      const event = this.events.get('iceCandidateError');
      if (event) event(ev);
      if (!env.production) {
        console.log('icecandidateerror: ', ev);
      }
    };

    this.conn.onnegotiationneeded = (ev) => {
      const event = this.events.get('negotiationNeeded');
      if (event) event(ev);
      if (!env.production) {
        console.log('negotiationneeded: ', ev);
      }
    };

    this.conn.onconnectionstatechange = (ev) => {
      const event = this.events.get('connectionStateChange');
      if (event) event(ev);
      if (!env.production) {
        console.log('connectionState: ', this.conn.connectionState);
      }
    };

    this.conn.onsignalingstatechange = (ev) => {
      const event = this.events.get('signalingStateChange');
      if (event) event(ev);
      if (!env.production) {
        console.log('signalingChange: ', this.conn.signalingState);
      }
    };

    this.conn.onicecandidate = (ev) => {
      const event = this.events.get('iceCandidate');
      if (event) event(ev);
    };

    this.conn.onicecandidate = ({ candidate }) => {
      if (!!this.onCandidate && candidate) {
        this.onCandidate(candidate);
      }
    };

    this.conn.ontrack = ({ streams }) => {
      if (!!this.onTrack) {
        this.onTrack(streams[0]);
      }
    };
  }

  on<K extends keyof ConnectionEventMap>(
    key: K,
    fn: Callback<ConnectionEventMap[K]>
  ) {
    this.events.set(key, fn);
  }

  setRemote(description: RTCSessionDescription) {
    this.conn.setRemoteDescription(description);
    console.log(5);
  }

  setTracks(stream: MediaStream) {
    stream.getTracks().forEach((t) => this.conn.addTrack(t, stream));
    console.log(6);
  }

  async create(options?: RTCOfferOptions) {
    return this.conn.createOffer(options).then((sdp) => {
      console.log(3);

      this.conn.setLocalDescription(sdp);
      return sdp;
    });
  }

  async answer(offer: RTCSessionDescription, options?: RTCOfferOptions) {
    return this.conn.setRemoteDescription(offer).then(() => {
      return this.conn.createAnswer(options).then((sdp) => {
        console.log(4);
        this.conn.setLocalDescription(sdp);
        return sdp;
      });
    });
  }
}
