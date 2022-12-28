import {SignalMessage} from '../interfaces/signal-message'
import {Socket} from '../interfaces/socket'

export abstract class Signaling<T extends Socket = Socket> {
  abstract conn: T

  abstract on(event: string, fn: (message: SignalMessage) => void): void

  abstract emit<T>(event: string, message: T): void
}
