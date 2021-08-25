export type DataEventMap = {
  /**
   * Um novo RTCDataChannelé despachado para o script
   * em resposta ao outro par criando um canal.
   */
  text: MessageEvent<string>;

  /**
   * Um novo RTCDataChannelé despachado para o script
   * em resposta ao outro par criando um canal.
   */
  file: MessageEvent<ArrayBuffer>;
}
