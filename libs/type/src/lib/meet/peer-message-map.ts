import {PeerMessage} from './peer-message'

export interface PeerMessageMap {
  message: PeerMessage
  connection: Pick<PeerMessage, 'user'>
  disconnection: Pick<PeerMessage, 'user'>
}
