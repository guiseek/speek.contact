export type DataEventMap = {
  /**
   * Um novo RTCDataChannelĂ© despachado para o script
   * em resposta ao outro par criando um canal.
   */
  text: MessageEvent<string>;

  /**
   * Um novo RTCDataChannelĂ© despachado para o script
   * em resposta ao outro par criando um canal.
   */
  file: MessageEvent<ArrayBuffer>;
}
