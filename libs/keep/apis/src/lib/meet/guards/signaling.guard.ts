import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common'
import {WsException} from '@nestjs/websockets'
import {Reflector} from '@nestjs/core'
import {IS_ALLOWED_KEY} from '@speek/keep/utils'
import {PeerMessage} from '@speek/type'

@Injectable()
export class SignalingGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const isAllowed = this.reflector.getAllAndOverride<boolean>(
      IS_ALLOWED_KEY,
      [context.getHandler(), context.getClass()]
    )
    if (isAllowed) {
      return true
    }
    return this.hasCall(context.switchToWs().getData())
  }

  hasCall({meet, user}: PeerMessage) {
    const hasMeet = meet && typeof meet === 'string'
    const hasUser = user && typeof user === 'string'
    if (!hasMeet) throw new WsException('Missing meet.')
    if (!hasUser) throw new WsException('Invalid user.')

    return hasMeet && hasUser
  }
}
