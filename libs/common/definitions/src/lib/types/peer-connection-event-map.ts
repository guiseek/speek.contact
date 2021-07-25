export type PeerConnectionEventMap = {
  /**
   * A nova mídia de entrada foi negociada para um
   * determinado RTCRtpReceivere esse receptor track foi
   * adicionado a quaisquer MediaStreams remotos associados.
   */
  track: MediaStreamTrack;

  /**
   * O navegador deseja informar ao aplicativo que
   * a negociação da sessão precisa ser feita, ou seja,
   * Um createOffer seguido por setLocalDescription.
   */
  negotiation: Event;

  /**
   * O estado de sinalização mudou. Essa mudança
   * de estado é o resultado de um setLocalDescriptionou
   * de setRemoteDescriptionser invocado.
   */
  signalingChange: RTCSignalingState;

  /**
   * O RTCIceConnectionState da conexão ICE mudou.
   */
  iceConnectionChange: RTCIceConnectionState;

  /**
   * O RTCPeerConnection's estado encontro ICE mudou.
   */
  iceGatheringChange: RTCIceGatheringState;

  /**
   * Um novo RTCIceCandidateé disponibilizado para o script.
   */
  iceCandidateChange: RTCIceCandidate;

  /**
   * A RTCPeerConnectionState mudou.
   */
  connectionChange: RTCPeerConnectionState;

  /**
   * Ocorreu uma falha ao reunir candidatos ICE.
   */
  iceCandidateError: RTCPeerConnectionIceErrorEvent;

  /**
   * Um novo RTCDataChannelé despachado para o script
   * em resposta ao outro par criando um canal.
   */
  dataChannel: RTCDataChannel;
};
